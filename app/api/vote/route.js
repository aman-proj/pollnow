import { pool } from "@/lib/db"

export async function POST(req) {
  const { pollId, optionId, userId, deviceId } = await req.json()

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Insert vote (will fail if duplicate due to UNIQUE constraint)
    await client.query(
      `INSERT INTO votes (poll_id, option_id, user_id, device_id)
       VALUES ($1, $2, $3, $4)`,
      [pollId, optionId, userId, deviceId]
    )

    // Increment count
    await client.query(
      `UPDATE options
       SET vote_count = vote_count + 1
       WHERE id = $1`,
      [optionId]
    )

    await client.query("COMMIT")

    return Response.json({ success: true })
  } catch (err) {
    await client.query("ROLLBACK")
    return Response.json(
      { error: "Already voted or error occurred" },
      { status: 400 }
    )
  } finally {
    client.release()
  }
}