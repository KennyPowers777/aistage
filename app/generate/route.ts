import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => null);
    if (!payload) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { imageUrl, theme, room, description } = payload;

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    // TODO: Replace with your actual generation call (Replicate/Inference/etc.)
    // For now, pretend we generated a new image. Use the same URL as a placeholder.
    const generatedUrl = imageUrl;

    return NextResponse.json(
      {
        ok: true,
        images: [imageUrl, generatedUrl],
        meta: { theme, room, description },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
