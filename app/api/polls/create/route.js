import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { question, options } = await req.json();

    // Validation
    if (!question || !question.trim()) {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    if (!options || !Array.isArray(options)) {
      return Response.json({ error: "Options must be an array" }, { status: 400 });
    }

    if (options.length < 2) {
      return Response.json(
        { error: "At least 2 options are required" },
        { status: 400 }
      );
    }

    if (options.length > 10) {
      return Response.json(
        { error: "Maximum 10 options allowed" },
        { status: 400 }
      );
    }

    const validOptions = options
      .filter((opt) => opt && typeof opt === "string" && opt.trim())
      .map((opt) => opt.trim());

    if (validOptions.length < 2) {
      return Response.json(
        { error: "At least 2 options must have text" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Insert poll - PostgreSQL will auto-generate UUID
      const pollRes = await client.query(
        `INSERT INTO polls (question, created_by, created_at)
         VALUES ($1, $2, NOW()) RETURNING id`,
        [question.trim(), session.user.id]
      );

      const pollId = pollRes.rows[0].id; // This is the UUID

      // Insert options
      for (let option of validOptions) {
        await client.query(
          `INSERT INTO options (poll_id, text)
           VALUES ($1, $2)`,
          [pollId, option]
        );
      }

      await client.query("COMMIT");

      console.log(`✅ Poll created: ${pollId} by user ${session.user.id}`);

      return Response.json({ pollId, success: true }, { status: 201 });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error creating poll:", err);
      return Response.json({ error: "Creation failed" }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error parsing request:", err);
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}