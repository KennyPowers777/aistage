import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = body?.prompt ?? "living room modern";
    const count = Math.min(Math.max(Number(body?.count ?? 1), 1), 8);

    // TODO: call your image-generation provider here.
    const images = Array.from({ length: count }, (_, i) => ({
      url: `/mock/generate/${encodeURIComponent(prompt)}-${i + 1}.jpg`,
    }));

    return NextResponse.json({ ok: true, prompt, images });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 400 });
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
    { error: "Method Not Allowed. Use POST." },
    { status: 405, headers: { Allow: "POST, OPTIONS" } }
  );
}
