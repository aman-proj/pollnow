import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const pollsRes = await pool.query(
    `
    SELECT DISTINCT p.id, p.question, p.created_at
    FROM votes v
    JOIN options o ON v.option_id = o.id
    JOIN polls p ON o.poll_id = p.id
    WHERE v.user_id = $1
    ORDER BY p.created_at DESC
    `,
    [userId]
  );

  const pollsWithOptions = await Promise.all(
    pollsRes.rows.map(async poll => {
      const optionsRes = await pool.query(
        `
        SELECT o.id, o.text, COUNT(v.id)::int as votes
        FROM options o
        LEFT JOIN votes v ON o.id = v.option_id
        WHERE o.poll_id = $1
        GROUP BY o.id
        ORDER BY o.id
        `,
        [poll.id]
      );

      const totalVotes = optionsRes.rows.reduce(
        (sum, opt) => sum + opt.votes,
        0
      );

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
}