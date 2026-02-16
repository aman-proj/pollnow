import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all polls created by the user
    const pollsRes = await pool.query(
      `SELECT p.id, p.question, p.created_at
       FROM polls p
       WHERE p.created_by = $1
       ORDER BY p.created_at DESC`,
      [session.user.id]
    );

    // For each poll, get options and vote counts
    const pollsWithOptions = await Promise.all(
      pollsRes.rows.map(async (poll) => {
        const optionsRes = await pool.query(
          `SELECT o.id, o.text, COUNT(v.id)::int as votes
           FROM options o
           LEFT JOIN votes v ON o.id = v.option_id
           WHERE o.poll_id = $1
           GROUP BY o.id, o.text
           ORDER BY o.id`,
          [poll.id]
        );

        const totalVotes = optionsRes.rows.reduce((sum, opt) => sum + opt.votes, 0);

        return {
          id: poll.id,
          question: poll.question,
          createdAt: poll.created_at,
          options: optionsRes.rows,
          totalVotes,
        };
      })
    );

    return Response.json(pollsWithOptions);
  } catch (err) {
    console.error("Error fetching my polls:", err);
    return Response.json({ error: "Failed to fetch polls" }, { status: 500 });
  }
}