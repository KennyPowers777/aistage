import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    // TEMP TEST RESPONSE (replace later with your upload logic)
    return NextResponse.json({ ok: true, fileName: file.name });
  } catch (err:any) {
    return NextResponse.json({ error: err.message ?? "Unknown failure" }, { status: 500 });
  }
}

// Optional (for preflight / browser auto OPTIONS)
export function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
