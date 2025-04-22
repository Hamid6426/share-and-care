"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import UploadItemImage from "@/app/donor/components/UploadItemImage";
import Image from "next/image";

type Condition = "new" | "used" | "poor";
// The picked up and donated fields are for the receiver to fill out, so we don't need them here
type Status = "available" | "claimed";

export default function EditItem() {
  const { itemId } = useParams() as { itemId: string };
  const router = useRouter();

  // loading / saving / error flags
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState<Condition>("used");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<Status>("available");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/api/items/my-items/${itemId}/get`);
        // populate editable states
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setCondition(data.condition);
        setQuantity(data.quantity);
        setStatus(data.status);
        setImages(Array.isArray(data.images) ? data.images : []);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [itemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.patch(`/api/items/my-items/${itemId}/update`, { title, description, category, condition, quantity, status });
      toast.success("Item updated!");
      router.back(); // or navigate elsewhere
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading item...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex justify-center items-center flex-col min-h-screen py-12 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-green-100 shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-green-700 text-center">Edit Item</h2>

        {/* Title */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-green-400 bg-white rounded-md px-3 py-2" required />
        </div>

        {/* Description */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-green-400 bg-white rounded-md px-3 py-2" rows={4} required />
        </div>

        {/* Category */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-green-400 bg-white rounded-md px-3 py-2" required />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value as Condition)} className="w-full border border-green-400 bg-white rounded-md px-3 py-2" required>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} min={1} className="w-full border border-green-400 bg-white rounded-md px-3 py-2" required />
        </div>

        {/* Status */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="w-full border border-green-400 bg-white rounded-md px-3 py-2" required>
            <option value="available">Available</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>

        {/* Save Button */}
        <button type="submit" disabled={saving} className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="w-full max-w-2xl bg-green-100 shadow-lg rounded-lg p-8 mt-12">
        {/* ──────── EXISTING IMAGES ──────── */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
            {Array.from({ length: 4 }).map((_, idx) => {
              const imageUrl = images[idx];
              return imageUrl ? (
                <Image key={idx} width={240} height={180} src={imageUrl} alt={`Item image ${idx + 1}`} className="rounded-md shadow border border-green-300 object-fill w-full aspect-square" />
              ) : (
                <div key={idx} className="flex items-center justify-center rounded-md shadow border border-green-300 bg-green-200 w-full aspect-square text-green-700 font-bold text-xl">
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* ──────── IMAGE UPLOADER ──────── */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Upload New Image</h3>
          <UploadItemImage
            itemId={itemId}
            onUploadSuccess={(imageUrl) => {
              setImages((imgs) => [...imgs, imageUrl]);
              toast.success("Image added!");
            }}
          />
        </div>
      </div>
    </div>
  );
}
