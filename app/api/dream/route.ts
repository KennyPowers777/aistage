import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

    // TODO: call Bria here using your Production/Staging key.
    // For now we just fake a URL so your UI stops crashing.
    const fakeUrl = `https://example.com/fake-dream.jpg`;

    return NextResponse.json({ ok: true, resultUrl: fakeUrl });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown" }, { status: 400 });
  }
}

export function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed. Use POST." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
