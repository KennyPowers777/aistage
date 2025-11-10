import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = body?.prompt ?? "";
    if (!prompt) {
      return NextResponse.json({ ok: false, error: "Missing prompt" }, { status: 400 });
    }

    // TODO: call your real staging backend here.
    // For now, return a known local asset so the client always gets JSON.
    return NextResponse.json({ ok: true, resultUrl: "/generated-pic-2.jpg" });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 400 });
  }
}

export function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed. Use POST." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
