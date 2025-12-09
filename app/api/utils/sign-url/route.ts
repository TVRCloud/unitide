import { NextResponse } from "next/server";
import { getSignedUrl } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path)
    return NextResponse.json({ error: "Missing path" }, { status: 400 });

  const signed = await getSignedUrl(path);

  return NextResponse.json({ url: signed });
}
