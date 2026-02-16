import { NextResponse } from "next/server";
import { initSocket } from "@/lib/socket";

export const dynamic = "force-dynamic"; // important

export async function GET(req) {
  const res = NextResponse.json({ ok: true });

  const server = req.socket?.server;

  if (!server.io) {
    server.io = initSocket(server);
  }

  return res;
}