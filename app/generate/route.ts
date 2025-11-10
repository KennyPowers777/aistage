// app/generate/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl, theme, room, description } = await req.json();

    if (!imageUrl || !theme || !room) {
      return NextResponse.json(
        { error: "Missing required fields: imageUrl, theme, room" },
        { status: 400 }
      );
    }

    // TODO: Replace this stub with your actual generation call.
    // Example:
    // const apiRes = await fetch("https://your-model-endpoint", { ... });
    // const apiData = await apiRes.json();
    // const stagedUrl = apiData.output?.[0];

    // Temporary echo so the client always gets valid JSON:
    const stagedUrl = imageUrl; // replace with real staged URL when wired

    return NextResponse.json({ output: [stagedUrl] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error parsing request" },
      { status: 500 }
    );
  }
}
