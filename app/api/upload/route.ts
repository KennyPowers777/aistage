import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // or "edge" if you prefer

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) {
      return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });
    }

    // TODO: save the file somewhere (S3, etc.). For demo, return a mock name.
    const filename = (file as any).name ?? "upload.jpg";
    return NextResponse.json({ ok: true, filename });
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
