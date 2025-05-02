"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";

interface UploadProfilePictureProps {
  onUploadSuccess?: (imageUrl: string) => void;
}

const UploadProfilePicture: React.FC<UploadProfilePictureProps> = ({ onUploadSuccess }) => {
  const { currentUser } = useAuth();
  const [previewUrl, setPreviewUrl] = useState<string>(currentUser?.profilePicture || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG or PNG)");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    handleUpload(file);

    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleUpload = async (file: File) => {
    if (!currentUser) {
      toast.error("You must be logged in to upload a profile picture");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const { data } = await axiosInstance.patch("/api/profile/upload-profile-picture", formData);

      toast.success("Profile picture updated successfully");
      onUploadSuccess?.(data.profilePicture);
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast.error(error.response?.data?.error || "Failed to upload profile picture");
      setPreviewUrl(currentUser?.profilePicture || "");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setPreviewUrl(currentUser?.profilePicture || "");
  }, [currentUser?.profilePicture]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 relative">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile picture"
              fill
              className="object-cover"
              sizes="(max-width: 128px) 100vw, 128px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-4xl">
                {currentUser?.name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}
          <div
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={triggerFileInput}
          >
            <FaCamera className="text-white text-2xl" />
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
      />

      <button
        onClick={triggerFileInput}
        disabled={isUploading}
        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? "Uploading..." : "Change Profile Picture"}
      </button>
    </div>
  );
};

export default UploadProfilePicture;
