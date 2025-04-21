"use client";
import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

interface Props {
  itemId: string;
  onUploadSuccess?: (imageUrl: string) => void;
}

const UploadItemImage: React.FC<Props> = ({ itemId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("No file selected");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Not authorized");

    const formData = new FormData();
    formData.append("itemImage", selectedFile);

    try {
      setIsUploading(true);
      const res = await axiosInstance.patch(`/api/items/my-items/${itemId}/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Image uploaded successfully!");
      if (onUploadSuccess) onUploadSuccess(res.data.imageUrl);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="block w-full"
      />
      <button
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default UploadItemImage;
