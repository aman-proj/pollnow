import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(req, { params }) {
  const { id } =  await params; 
  const { optionId } = await req.json();

  // Get user session
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Anti-abuse: Get fingerprint
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const fingerprint = `${ip}_${userAgent.substring(0, 50)}`;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if user already voted on this poll
    const existingVote = await client.query(
      `SELECT v.id FROM votes v
       JOIN options o ON v.option_id = o.id
       WHERE o.poll_id = $1 AND v.user_id = $2`,
      [id, userId]
    );

    if (existingVote.rows.length > 0) {
      await client.query("ROLLBACK");
      return Response.json({ 
        error: "You have already voted on this poll" 
      }, { status: 400 });
    }

    // Rate limiting check
    const recentVotes = await client.query(
      `SELECT COUNT(*) as count FROM votes
       WHERE fingerprint = $1 
       AND created_at > NOW() - INTERVAL '1 minute'`,
      [fingerprint]
    );

    if (parseInt(recentVotes.rows[0].count) >= 3) {
      await client.query("ROLLBACK");
      return Response.json({ 
        error: "Too many votes from your device. Please wait a moment." 
      }, { status: 429 });
    }

    // Verify option belongs to this poll
    const optionCheck = await client.query(
      `SELECT id FROM options WHERE id = $1 AND poll_id = $2`,
      [optionId, id]
    );

    if (optionCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return Response.json({ error: "Invalid option" }, { status: 400 });
    }

    
   await client.query(
  `INSERT INTO votes (option_id, user_id, fingerprint, poll_id)
   VALUES ($1, $2, $3, $4)`,
  [optionId, userId, fingerprint, id]
);

    await client.query("COMMIT");

    return Response.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error submitting vote:", err);
    return Response.json({ error: "Vote failed" }, { status: 500 });
  } finally {
    client.release();
  }
}