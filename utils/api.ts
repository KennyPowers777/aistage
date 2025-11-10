// utils/api.ts

export async function uploadImage(file: File) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: fd,
    headers: { Accept: "application/json" }
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : { ok: false, error: await res.text() };

  if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export async function dream(prompt: string, imageUrl?: string) {
  const res = await fetch("/dream", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ prompt, imageUrl })
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export async function generate(prompt: string, count = 1) {
  const res = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ prompt, count })
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data.results;
}
