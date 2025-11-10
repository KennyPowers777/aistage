// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

// If you need to restrict this, replace "*" with your origin.
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

export async function OPTIONS() {
  // Preflight response
  return json({}, 200);
}

export async function GET() {
  // Explicitly disallow GET but return JSON, not an empty body
  return json(
    { ok: false, error: "Method Not Allowed. Use POST." },
    { status: 405, headers: { Allow: "POST, OPTIONS" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return json({ ok: false, error: 'Missing "file" in multipart/form-data.' }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const size = arrayBuffer.byteLength;

    // You can persist the file to storage here.
    // For now we just echo metadata back to the client.
    return json({
      ok: true,
      filename: file.name || "unnamed",
      mime: file.type || "application/octet-stream",
      size,
      message: "File received successfully.",
    });
  } catch (err: any) {
    return json({ ok: false, error: err?.message ?? "Unknown upload error" }, 400);
  }
}
