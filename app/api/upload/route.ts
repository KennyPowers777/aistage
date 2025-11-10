import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
    }
    // TODO: store the file somewhere (S3, etc.). For now we just echo back the name.
    return NextResponse.json({ ok: true, filename: file.name });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown" }, { status: 400 });
  }
}

export function OPTIONS() {
  return NextResponse.json(
    {},
    {
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
