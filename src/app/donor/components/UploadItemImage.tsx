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
    console.log("Selected file:", file);
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("No file selected");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Not authorized");

    const formData = new FormData();
    console.log("Incoming form data:", formData.get("itemImage"));
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
    <div className="space-y-4">
      {/* Hidden file input */}
      <input id="fileUpload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="hidden" />

      {/* Custom styled label acting as button */}
      <label htmlFor="fileUpload" className="inline-block mr-4 cursor-pointer bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded">
        Choose File
      </label>

      {/* Show selected file name (optional) */}
      {selectedFile && <p className="text-sm text-gray-700">Selected: {selectedFile.name}</p>}

      {/* Upload button */}
      <button type="button" onClick={handleUpload} disabled={isUploading || !selectedFile} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50">
        {isUploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default UploadItemImage;
