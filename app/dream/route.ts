// app/dream/route.ts
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
 * Minimal image “staging” endpoint.
 * Expects JSON like:
 * { "prompt": "modern bedroom", "imageUrl": "...optional...", "extras": { ... } }
 * Returns a stubbed result your UI can consume immediately.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, imageUrl, extras } = body || {};

    if (!prompt || typeof prompt !== "string") {
      return json({ ok: false, error: 'Missing required string "prompt".' }, 400);
    }

    // TODO: plug your real model/service here.
    const id = `dream_${Date.now()}`;

    return json({
      ok: true,
      id,
      prompt,
      imageUrl: imageUrl ?? null,
      // For now we just return a placeholder URL you can swap later.
      resultUrl: "/placeholder/dream-result.png",
      extras: extras ?? null,
      message: "Dream job completed (stub). Replace with real generation when ready.",
    });
  } catch (err: any) {
    return json({ ok: false, error: err?.message ?? "Unknown error" }, 400);
  }
}
