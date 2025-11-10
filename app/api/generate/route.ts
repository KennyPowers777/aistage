import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = (body?.prompt ?? "").toString().trim();
    const count = Number(body?.count ?? 1);

    if (!prompt) {
      return NextResponse.json(
        { ok: false, error: "Missing 'prompt' in JSON body." },
        { status: 400 }
      );
    }
    if (!Number.isFinite(count) || count < 1 || count > 8) {
      return NextResponse.json(
        { ok: false, error: "'count' must be 1–8" },
        { status: 400 }
      );
    }

    // Demo stub. Replace with real image URLs if you call a model.
    const images = Array.from({ length: count }, (_, i) => ({
      url: `/placeholder/generate-${encodeURIComponent(prompt)}-${i + 1}.png`,
    }));

    return NextResponse.json({ ok: true, images });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Generate failed" },
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

