"use client";

import { useState } from "react";
import Image from "next/image";
import { UrlBuilder } from "@bytescale/sdk";
import { UploadWidgetConfig } from "@bytescale/upload-widget";
import { UploadDropzone } from "@bytescale/upload-widget-react";
import { AnimatePresence, motion } from "framer-motion";
import ResizablePanel from "../../components/ResizablePanel";
import Toggle from "../../components/Toggle";
import LoadingDots from "../../components/LoadingDots";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DropDown from "../../components/DropDown";
import appendNewToName from "../../utils/appendNewToName";
import downloadPhoto from "../../utils/downloadPhoto";
import { roomType, rooms, themeType, themes } from "../../utils/dropdownTypes";

const options: UploadWidgetConfig = {
  apiKey: process.env.NEXT_PUBLIC_UPLOAD_API_KEY || "free",
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: {
    colors: {
      primary: "#2563EB",
      error: "#d23f4d",
      shade100: "#fff",
      shade200: "#fffe",
      shade300: "#fffd",
      shade400: "#fffc",
      shade500: "#fff9",
      shade600: "#fff7",
      shade700: "#fff2",
      shade800: "#fff1",
      shade900: "#ffff",
    },
  },
};

export default function DreamPage() {
  const [description, setDescription] = useState("");
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [restoredLoaded, setRestoredLoaded] = useState(false);
  const [sideBySide, setSideBySide] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>("Modern");
  const [room, setRoom] = useState<roomType>("Living Room");

  const UploadDropZone = () => (
    <UploadDropzone
      options={options}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length) {
          const image = uploadedFiles[0];
          const imageName = image.originalFile.originalFileName;
          const imageUrl = UrlBuilder.url({
            accountId: image.accountId,
            filePath: image.filePath,
            options: { transformation: "preset", transformationPreset: "thumbnail" },
          });
          setPhotoName(imageName);
          setOriginalPhoto(imageUrl);
          generatePhoto(imageUrl);
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generatePhoto(fileUrl: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: fileUrl, theme, room, description }),
      });

      // If server didn’t return JSON, surface readable error
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          `Server did not return JSON. Status ${res.status}. Body: ${text?.slice(0, 300) || "(empty)"}`
        );
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data === "string" ? data : data?.error || "Generation failed.");
      }

      // Expecting { images: [origUrl, newUrl] } or similar
      const newUrl = Array.isArray(data?.images) ? data.images[1] : data?.image || null;
      if (!newUrl) throw new Error("API response missing generated image URL.");
      setRestoredImage(newUrl);
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
          Generate your <span className="text-blue-600">dream</span> room
        </h1>
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="flex justify-between items-center w-full flex-col mt-4">
              {!restoredImage && (
                <>
                  {/* Theme */}
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="flex mt-3 items-center space-x-3">
                      <Image src="/number-1-white.svg" width={30} height={30} alt="1" />
                      <p className="text-left font-medium">Choose your room theme.</p>
                    </div>
                    <DropDown theme={theme} setTheme={(t) => setTheme(t as themeType)} themes={themes} />
                  </div>

                  {/* Room */}
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="flex mt-10 items-center space-x-3">
                      <Image src="/number-2-white.svg" width={30} height={30} alt="2" />
                      <p className="text-left font-medium">Choose your room type.</p>
                    </div>
                    <DropDown theme={room} setTheme={(r) => setRoom(r as roomType)} themes={rooms} />
                  </div>

                  {/* Description textarea just below the room dropdown */}
                  <div className="space-y-2 w-full max-w-sm mt-6">
                    <label className="block text-left font-medium">Optional description / instructions</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Style Package A. Professional Chinese buyer in Markham. Add S/S appliances, widen living look, highlight natural light, premium dining, enlarge bedrooms, more luxurious baths."
                      className="w-full rounded-xl border border-gray-600 bg-transparent p-3 outline-none"
                      rows={4}
                    />
                  </div>

                  {/* Upload */}
                  <div className="mt-4 w-full max-w-sm">
                    <div className="flex mt-6 w-96 items-center space-x-3">
                      <Image src="/number-3-white.svg" width={30} height={30} alt="3" />
                      <p className="text-left font-medium">Upload a picture of your room.</p>
                    </div>
                  </div>
                </>
              )}

              {restoredImage && (
                <div>
                  Here&apos;s your remodeled <b>{room.toLowerCase()}</b> in the <b>{theme.toLowerCase()}</b> theme!
                </div>
              )}

              <div className={`${restoredLoaded ? "visible mt-6 -ml-8" : "invisible"}`}>
                <Toggle
                  className={`${restoredLoaded ? "visible mb-6" : "invisible"}`}
                  sideBySide={sideBySide}
                  setSideBySide={setSideBySide}
                />
              </div>

              {/* Image areas */}
              {!originalPhoto && <UploadDropZone />}

              {originalPhoto && !restoredImage && (
                <Image alt="original photo" src={originalPhoto} className="rounded-2xl h-96" width={475} height={475} />
              )}

              {restoredImage && originalPhoto && !sideBySide && (
                <div className="flex sm:space-x-4 sm:flex-row flex-col">
                  <div>
                    <h2 className="mb-1 font-medium text-lg">Original Room</h2>
                    <Image
                      alt="original photo"
                      src={originalPhoto}
                      className="rounded-2xl relative w-full h-96"
                      width={475}
                      height={475}
                    />
                  </div>
                  <div className="sm:mt-0 mt-8">
                    <h2 className="mb-1 font-medium text-lg">Generated Room</h2>
                    <a href={restoredImage} target="_blank" rel="noreferrer">
                      <Image
                        alt="restored photo"
                        src={restoredImage}
                        className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in w-full h-96"
                        width={475}
                        height={475}
                        onLoadingComplete={() => setRestoredLoaded(true)}
                      />
                    </a>
                  </div>
                </div>
              )}

              {loading && (
                <button disabled className="bg-blue-500 rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40">
                  <span className="pt-4">
                    <LoadingDots color="white" style="large" />
                  </span>
                </button>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div className="flex space-x-2 justify-center">
                {originalPhoto && !loading && (
                  <button
                    onClick={() => {
                      setOriginalPhoto(null);
                      setRestoredImage(null);
                      setRestoredLoaded(false);
                      setError(null);
                    }}
                    className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-blue-500/80 transition"
                  >
                    Generate New Room
                  </button>
                )}
                {restoredLoaded && (
                  <button
                    onClick={() => {
                      downloadPhoto(restoredImage!, appendNewToName(photoName!));
                    }}
                    className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
                  >
                    Download Generated Room
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
}
