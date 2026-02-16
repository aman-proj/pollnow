import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ hasVoted: false, selectedId: null });
  }

  try {
    const result = await pool.query(
  `SELECT v.option_id
   FROM votes v
   JOIN options o ON v.option_id = o.id
   WHERE o.poll_id = $1 AND v.user_id = $2`,
  [id, session.user.id]
);

    if (result.rows.length > 0) {
      return Response.json({
        hasVoted: true,
        selectedId: result.rows[0].option_id,
      });
    }

    return Response.json({ hasVoted: false, selectedId: null });

  } catch (err) {
    console.error("Error checking vote:", err);
    return Response.json({ error: "Check failed" }, { status: 500 });
  }
}