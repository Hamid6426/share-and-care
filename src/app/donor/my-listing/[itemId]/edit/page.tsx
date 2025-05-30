"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

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

  console.log(images);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/api/items/${itemId}`);
        // populate editable states
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setCondition(data.condition);
        setQuantity(data.quantity);
        setStatus(data.status);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.patch(`/api/items/${itemId}`, {
        title,
        description,
        category,
        condition,
        quantity,
        status,
      });
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
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-green-100 shadow-lg rounded-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-green-700 text-center">
          Edit Item
        </h2>

        {/* Title */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-green-400 bg-white rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-green-800 text-sm mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-green-400 bg-white rounded-md px-3 py-2"
            rows={4}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-green-400 bg-white rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
            className="w-full border border-green-400 bg-white rounded-md px-3 py-2"
            required
          >
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            min={1}
            className="w-full border border-green-400 bg-white rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-green-800 text-sm mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full border border-green-400 bg-white rounded-md px-3 py-2"
            required
          >
            <option value="available">Available</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
