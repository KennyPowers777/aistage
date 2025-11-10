// app/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data: any, init?: number | ResponseInit) {
  const base: ResponseInit =
    typeof init === "number" ? { status: init } : init || {};
  return NextResponse.json(data, { ...base, headers: { ...CORS_HEADERS, ...(base.headers || {}) } });
}

export function OPTIONS() {
  return json({}, 200);
}

export function GET() {
  return json(
    { ok: false, error: "Method Not Allowed. Use POST." },
    { status: 405, headers: { Allow: "POST, OPTIONS" } }
  );
}

/**
 * Text/image generation endpoint (stub).
 * Expects JSON like:
 * { "prompt": "living room, modern, do not obstruct windows", "count": 1 }
 * Returns an array of result items that your UI can display.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, count = 1 } = body || {};

    if (!prompt || typeof prompt !== "string") {
      return json({ ok: false, error: 'Missing required string "prompt".' }, 400);
    }

    const n = Math.max(1, Math.min(8, Number(count) || 1));
    const results = Array.from({ length: n }).map((_, i) => ({
      id: `gen_${Date.now()}_${i + 1}`,
      url: "/placeholder/generated.png", // swap to your real output URL
      meta: { prompt, index: i },
    }));

    return json({ ok: true, results });
  } catch (err: any) {
    return json({ ok: false, error: err?.message ?? "Unknown error" }, 400);
  }
}
