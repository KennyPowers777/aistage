"use client";

import { useState } from "react";
import { uploadImage, dream, generate } from "@/utils/api";

import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SquigglyLines from "../components/SquigglyLines";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [log, setLog] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  async function handleUpload() {
    if (!file) return;
    setLog("Uploading...");
    setPreviewUrls([]);
    try {
      const result = await uploadImage(file);
      setLog(`✅ Uploaded: ${result.filename} (${result.size} bytes)`);
    } catch (err: any) {
      setLog(`❌ ${err.message}`);
    }
  }

  async function handleDream() {
    setLog("Generating staged result...");
    setPreviewUrls([]);
    try {
      const result = await dream("modern bedroom staging");
      setPreviewUrls([result.resultUrl]);
      setLog(`✅ Dream image ready`);
    } catch (err: any) {
      setLog(`❌ ${err.message}`);
    }
  }

  async function handleGenerate() {
    setLog("Generating variations...");
    setPreviewUrls([]);
    try {
      const results = await generate("living room modern", 2);
      setPreviewUrls(results.map((r) => r.url));
      setLog(`✅ Generated ${results.length} images`);
    } catch (err: any) {
      setLog(`❌ ${err.message}`);
    }
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />

      {/* --- Simple test bench UI (top) --- */}
      <div className="w-full max-w-2xl border border-gray-800 rounded-2xl p-4 my-6">
        <h2 className="text-lg font-semibold mb-3">API Test Bench</h2>

        <div className="flex items-center gap-3">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-3 py-2"
          >
            Upload Image
          </button>
          <button
            onClick={handleDream}
            className="bg-purple-600 hover:bg-purple-500 text-white rounded-md px-3 py-2"
          >
            Dream (Stage)
          </button>
          <button
            onClick={handleGenerate}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-md px-3 py-2"
          >
            Generate Variations
          </button>
        </div>

        <p className="text-sm text-gray-300 mt-3">{log}</p>

        {!!previewUrls.length && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {previewUrls.map((u) => (
              <div key={u} className="relative w-full aspect-square bg-black/30 rounded-xl overflow-hidden">
                {/* Using next/image with placeholders; replace with real URLs when you wire your model */}
                <Image src="/generated-pic-2.jpg" alt="preview" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Your existing hero/marketing content (unchanged) --- */}
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-10 mt-6 background-gradient">
        <a
          href="https://vercel.fyi/roomGPT"
          target="_blank"
          rel="noreferrer"
          className="border border-gray-700 rounded-lg py-2 px-4 text-gray-400 text-sm mb-5 transition duration-300 ease-in-out"
        >
          Clone and deploy your own with <span className="text-blue-600">Vercel</span>
        </a>
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-7xl">
          Generating dream rooms{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <SquigglyLines />
            <span className="relative">using AI</span>
          </span>{" "}
          for everyone.
        </h1>
        <h2 className="mx-auto mt-12 max-w-xl text-lg sm:text-gray-400  text-gray-500 leading-7">
          Take a picture of your room and see how your room looks in different themes. 100% free – remodel your room today.
        </h2>
        <Link
          className="bg-blue-600 rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-blue-500 transition"
          href="/dream"
        >
          Generate your dream room
        </Link>
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
          <div className="flex flex-col space-y-10 mt-4 mb-16">
            <div className="flex sm:space-x-8 sm:flex-row flex-col">
              <div>
                <h3 className="mb-1 font-medium text-lg">Original Room</h3>
                <Image
                  alt="Original photo of a room"
                  src="/original-pic.jpg"
                  className="w-full object-cover h-96 rounded-2xl"
                  width={400}
                  height={400}
                />
              </div>
              <div className="sm:mt-0 mt-8">
                <h3 className="mb-1 font-medium text-lg">Generated Room</h3>
                <Image
                  alt="Generated photo of a room"
                  width={400}
                  height={400}
                  src="/generated-pic-2.jpg"
                  className="w-full object-cover h-96 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
