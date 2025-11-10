// utils/api.ts

async function safeJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return await res.json();

  const text = await res.text().catch(() => "");
  throw new Error(
    `Expected JSON but got ${res.status} ${res.statusText} (${ct || "no content-type"}). Body: ${text.slice(0,200)}`
  );
}

export async function uploadImage(file: File) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: fd,
    headers: { Accept: "application/json" }, // do NOT set Content-Type for FormData
  });

  if (!res.ok) {
    if (res.status === 405) {
      const allow = res.headers.get("Allow") || "";
      throw new Error(`405 Method Not Allowed. Allowed: ${allow}`);
    }
  }
  const data = await safeJson(res);
  if (!data?.ok) throw new Error(data?.error || "Upload failed");
  return data as { ok: true; filename: string; size: number; type: string };
}

export async function dream(prompt: string) {
  const res = await fetch("/api/dream", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await safeJson(res);
  if (!data?.ok) throw new Error(data?.error || "Dream failed");
  return data as { ok: true; resultUrl: string };
}

export async function generate(prompt: string, count = 2) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ prompt, count }),
  });
  const data = await safeJson(res);
  if (!data?.ok) throw new Error(data?.error || "Generate failed");
  return (data as { ok: true; images: { url: string }[] }).images;
}
