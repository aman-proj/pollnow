import { pool } from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = await params;
  
  try {
    // Get poll details 
    const pollRes = await pool.query(
      `SELECT p.id, p.question, p.created_by, p.created_at,
              u.name as creator_name, u.email as creator_email
       FROM polls p
       LEFT JOIN users u ON p.created_by = u.id::text
       WHERE p.id = $1`,
      [id]
    );

    if (pollRes.rows.length === 0) {
      return Response.json({ error: "Poll not found" }, { status: 404 });
    }

    const poll = pollRes.rows[0];

    // Get all options with vote counts
    const optionsRes = await pool.query(
      `SELECT o.id, o.text, COUNT(v.id)::int as votes
       FROM options o
       LEFT JOIN votes v ON o.id = v.option_id
       WHERE o.poll_id = $1
       GROUP BY o.id, o.text
       ORDER BY o.id`,
      [id]
    );

    // Calculate total votes
    const totalVotes = optionsRes.rows.reduce((sum, opt) => sum + opt.votes, 0);

    return Response.json({
      id: poll.id,
      question: poll.question,
      createdBy: poll.created_by,
      creatorName: poll.creator_name,
      createdAt: poll.created_at,
      options: optionsRes.rows,
      totalVotes,
    });
  } catch (err) {
    console.error("Error fetching poll:", err);
    return Response.json({ error: "Failed to fetch poll" }, { status: 500 });
  }
}