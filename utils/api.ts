export async function safeJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  throw new Error(`Expected JSON but got ${res.status} ${res.statusText} (${ct || "no content-type"}). Body: ${text.slice(0,200)}`);
}

export async function uploadImage(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Upload failed ${res.status}`);
  return safeJson(res);
}

export async function dream(prompt: string) {
  const res = await fetch("/api/dream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`Dream failed ${res.status}`);
  return safeJson(res);
}

export async function generate(prompt: string, n = 1) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, n }),
  });
  if (!res.ok) throw new Error(`Generate failed ${res.status}`);
  const data = await safeJson(res);
  return data.urls as string[];
}
