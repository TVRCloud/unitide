import { NextResponse } from "next/server";
import { logServerError } from "@/lib/logServerError";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await logServerError({
      ...body,
      source: "client",
    });
  } catch {}

  return NextResponse.json({ ok: true });
}
