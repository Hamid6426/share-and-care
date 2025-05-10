"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import UploadItemImage from "@/app/donor/components/UploadItemImage";
import Image from "next/image";
import { MdClose } from "react-icons/md";

export default function AddPictures() {
  const { itemId } = useParams() as { itemId: string };

  // loading / saving / error flags
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/api/items/${itemId}`);
        // populate editable states
        setImages(Array.isArray(data.images) ? data.images : []);
      } catch (err: any) {
        setError(
          err.response?.data?.error || err.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [itemId]);

  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authorized");

      await axiosInstance.delete(`/api/items/${itemId}/donor-actions/remove-image`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { imageUrl },
      });

      setImages((prev) => prev.filter((img) => img !== imageUrl));
      toast.success("Image removed successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to delete image");
    }
  };

  if (loading) return <p className="text-center py-10">Loading item...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full rounded-lg">
      {/* ──────── EXISTING IMAGES ──────── */}
      <div>
         <div className="grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => {
              const imageUrl = images[idx];
              return imageUrl ? (
                <div key={idx} className="relative">
                  <Image
                    width={240}
                    height={180}
                    src={imageUrl}
                    alt={`Item image ${idx + 1}`}
                    className="rounded-md aspect-[4/3] shadow border border-green-300 object-fill w-full"
                  />
                  <button
                    onClick={() => handleDeleteImage(imageUrl)}
                    className="absolute top-2 right-2 bg-white shadow-lg p-1 cursor-pointer"
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              ) : (
                <div
                  key={idx}
                  className="flex items-center justify-center rounded-md shadow border border-green-300 bg-green-200 w-full aspect-[4/3] text-green-700 font-bold text-xl"
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
      </div>

      {/* ──────── IMAGE UPLOADER ──────── */}
      <div className="mt-3 w-full">
        <UploadItemImage
          itemId={itemId}
          onUploadSuccess={(imageUrl) => {
            setImages((imgs) => [...imgs, imageUrl]);
            toast.success("Image added!");
          }}
        />
      </div>
    </div>
  );
}
