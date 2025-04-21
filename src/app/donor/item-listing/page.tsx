"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { toast } from "react-toastify";
import { IItem } from "@/models/Item";

const GetItems: React.FC = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get<IItem[]>("/api/items");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <p className="text-center py-10">Loading items…</p>;
  if (!items.length) return <p className="text-center py-10 text-gray-600">No donation items found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Available Donation Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* {items.map((item) => (
          <div key={item._id} className="bg-white border border-green-300 rounded-lg shadow p-4 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-green-700">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.category}</p>
            <p className="text-xs text-gray-500">Donor: {item.donor?.name || "Unknown"}</p>
            <p className="text-xs text-gray-500">Claimed by: {item.receiver?.name || "Not claimed"}</p>

            <Link href={`/items/${item._id}`} className="inline-block mt-3 text-green-600 hover:underline text-sm">
              View Details →
            </Link>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default GetItems;
