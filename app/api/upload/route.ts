import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No file provided (key should be 'file')." },
        { status: 400 }
      );
    }

    // Demo: we are not persisting on disk here (Vercel fs is ephemeral).
    // This route simply echoes metadata back.
    return NextResponse.json({
      ok: true,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Upload failed" },
      { status: 400 }
    );
  }
}

// Handle preflight if you ever call this from another origin
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

// Make 405s return JSON (prevents "Unexpected end of JSON input")
export function GET() {
  return NextResponse.json(
    { ok: false, error: "Method Not Allowed. Use POST." },
    { status: 405, headers: { Allow: "POST, OPTIONS" } }
  );
}
