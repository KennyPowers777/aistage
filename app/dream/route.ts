import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = (body?.prompt ?? "").toString().trim();

    if (!prompt) {
      return NextResponse.json(
        { ok: false, error: "Missing 'prompt' in JSON body." },
        { status: 400 }
      );
    }

    // Demo stub. Replace with your model call if needed.
    const resultUrl = `/placeholder/dream-${encodeURIComponent(prompt)}.png`;

    return NextResponse.json({ ok: true, resultUrl });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Dream generation failed" },
      { status: 400 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export function GET() {
  return NextResponse.json(
    { ok: false, error: "Method Not Allowed. Use POST." },
    { status: 405, headers: { Allow: "POST, OPTIONS" } }
  );
}
