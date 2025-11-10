async function safeJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  throw new Error(
    `Expected JSON, got ${res.status} ${res.statusText} (${ct || "no content-type"}). Body: ${text.slice(0,200)}`
  );
}

export async function uploadImage(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await safeJson(res);
  if (!res.ok || !data?.ok) throw new Error(data?.error || `Upload failed (${res.status})`);
  return data as { ok: true; filename: string };
}

export async function dream(prompt: string) {
  const res = await fetch("/api/dream", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await safeJson(res);
  if (!res.ok || !data?.ok) throw new Error(data?.error || `Dream failed (${res.status})`);
  return data as { ok: true; resultUrl: string };
}

export async function generate(prompt: string, n = 2) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ prompt, n }),
  });
  const data = await safeJson(res);
  if (!res.ok || !data?.ok) throw new Error(data?.error || `Generate failed (${res.status})`);
  // Return the array because your page does results.length
  return (data as { ok: true; results: string[] }).results;
}
