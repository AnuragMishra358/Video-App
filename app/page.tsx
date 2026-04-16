"use client";

import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { Video } from "@imagekit/next";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // console.log("get allvideos ");
        const allVideos: IVideo[] = await apiClient.getVideos();
        // console.log("allvideos => ",allVideos);
        setVideos(allVideos);
      } catch (error) {
        console.log("Error in Fetching videos => ",error);
      }
    };
    fetchVideos();
  }, []);

  const { data } = useSession();
  // console.log("data",data?.user?.email);

  const handleSuccess = async (res: any) => {
    setUploading(false);
    setProgress(0);
    // console.log("res",res);
    try {
      await apiClient.createVideo({
        videoUrl: res.url,
        description: res.description ?? "nothing",
        title: res.name,
        thumbnailUrl: res.thumbnailUrl ?? res.url,
        transformation: {
          height: res?.height,
          width: res?.width,
        },
      });
      const updatedVideos: IVideo[] = await apiClient.getVideos();
      setVideos(updatedVideos);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProgress = (p: number) => {
    if (!uploading) setUploading(true);
    setProgress(p);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 to-slate-900 text-white ">
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <button onClick={() => setOpen(true)} className="text-white text-2xl">
          ☰
        </button>

        <h1 className="text-lg font-semibold">Home</h1>
      </div>
      <div className="flex">
        {/* LEFT SIDE (Fixed) */}
        <div
          className={`fixed md:static top-0 left-0 h-screen w-[80%] sm:w-1/2 md:w-1/3 lg:w-1/4 bg-slate-950 z-50 transform transition-transform duration-300 
  ${open ? "translate-x-0" : "-translate-x-full"} 
  md:translate-x-0 md:flex  flex-col justify-center items-center px-6 text-center border-r border-slate-800`}
        >
          {/* Close button (mobile only) */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-xl md:hidden"
          >
            ✕
          </button>
          <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
            Welcome
          </h1>

          <p className="text-gray-400 mb-10 text-sm lg:text-base max-w-xs">
            Upload your content and start your journey today!
          </p>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            {data ? (
              <div className="flex flex-col gap-4 items-center">
                {/* Upload */}
                <div className="w-full">
                  <FileUpload
                    onSuccess={handleSuccess}
                    onProgress={handleProgress}
                    fileType="video"
                  />
                  {uploading && (
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => signOut()}
                  className="w-full bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg font-medium shadow-md hover:scale-105 active:scale-95"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <a
                  href="/register"
                  className="w-full text-center bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 active:scale-95"
                >
                  Get Started
                </a>

                <a
                  href="/login"
                  className="w-full text-center border border-gray-600 hover:bg-gray-800 transition px-6 py-3 rounded-xl text-lg hover:scale-105 active:scale-95"
                >
                  Login
                </a>
              </div>
            )}
          </div>
        </div>

        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* RIGHT SIDE (Scrollable Videos) */}
        <div className="w-full md:w-2/3 lg:w-3/4 h-screen overflow-y-auto px-4 sm:px-6 py-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center md:text-left">
            Explore Videos
          </h2>

          {videos.length === 0 ? (
            <p className="text-center text-gray-500 mt-10 text-lg">
              No Video Found
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {videos.map((v) => (
                <div
                  key={v._id?.toString()}
                  className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-3 shadow-md hover:shadow-xl transition duration-300 hover:scale-[1.03]"
                >
                  <Video
                    urlEndpoint="https://ik.imagekit.io/qlzxoilfqt"
                    src={v.videoUrl}
                    controls={v.controls ?? true}
                    width={500}
                    height={300}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
