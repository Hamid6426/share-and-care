"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: "new" | "used" | "poor";
  images: string[];
  quantity: number;
  status: "available" | "claimed" | "picked-up" | "donated";
  donor: any;
  receiver?: any;
  createdAt: string;
  updatedAt: string;
}

export default function ItemPage() {
  const { itemId } = useParams() as { itemId: string };
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/items/my-items/${itemId}/get`);
        setItem(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [itemId]);

  if (loading) return <p className="text-center py-10">Loading item...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!item) return <p className="text-center">Item not found.</p>;

  return (
    <div className="flex justify-center items-start min-h-screen py-12 px-4">
      <div className="w-full max-w-2xl bg-green-100 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Item Details</h2>

        <div className="space-y-4">
          <FormField label="Title" value={item.title} />
          <FormField label="Description" value={item.description} />
          <FormField label="Category" value={item.category} />
          <FormField label="Condition" value={item.condition} />
          <FormField label="Status" value={item.status} />
          <FormField label="Quantity" value={item.quantity.toString()} />
          <FormField label="Donor" value={item.donor.name || "N/A"} />
          {item.receiver && <FormField label="Receiver ID" value={item.receiver._id} />}
          <FormField label="Created At" value={new Date(item.createdAt).toLocaleString()} />
          <FormField label="Updated At" value={new Date(item.updatedAt).toLocaleString()} />

          <div>
            <label className="block text-green-800 text-sm mb-1">Images:</label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              {loading || item.images.length === 0
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-center rounded-md shadow border border-green-300 bg-green-200 h-32 text-green-700 font-bold text-xl animate-pulse">
                      {idx + 1}
                    </div>
                  ))
                : item.images.map((src, idx) => <img key={idx} src={src} alt={`Item image ${idx}`} className="rounded-md shadow border border-green-300 h-32 object-cover" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-green-800 text-sm mb-1">{label}:</label>
      <input type="text" value={value} readOnly className="w-full border border-green-400 bg-green-50 text-green-900 rounded-md px-3 py-2" />
    </div>
  );
}
