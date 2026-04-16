"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {

  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) return;

   
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();
      // console.log("auth   ",auth);

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature: auth.authenticationParameters.signature,
        expire: auth.authenticationParameters.expire,
        token: auth.authenticationParameters.token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });
      onSuccess(res);
    } catch (error) {
      console.log("Upload Failed", error);
    } 
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-full">
        {/* File Input */}
        <label className="w-full cursor-pointer">
          <div className="flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-blue-400 transition rounded-xl py-6 px-4 text-center bg-slate-800/50 hover:bg-slate-800">
            <span className="text-gray-300 text-sm sm:text-base">
              Click to upload {fileType === "video" ? "video " : "image "}
            </span>

            <input
              type="file"
              accept={fileType === "video" ? "video/*" : "image/*"}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </label>

        {/* Loading State */}
        {error && (
          <div className="flex items-center gap-2 text-blue-400 text-sm">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default FileUpload;
