// src/app/receiver-dashboard/claimed-items/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

interface Item {
  _id: string;
  title: string;
  quantity: number;
  category: string;
  condition: string;
  donor: {
    name: string;
    email: string;
  };
  isAccepted: boolean;
  isPicked: boolean;
  status: string;
}

const ClaimedItems = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClaimedItems = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/items/receiver/claimed-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const claimed = res.data.items.filter(
        (item: Item) =>
          item.status === "claimed" && item.isAccepted && !item.isPicked
      );
  
      setItems(claimed);
    } catch {
      toast.error("Failed to fetch claimed items");
    } finally {
      setLoading(false);
    }
  }, [token]); // Only depend on token  

  const handleMarkPicked = async (itemId: string) => {
    try {
      await axiosInstance.post(`/api/items/${itemId}/receiver-actions/item-picked`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Item marked as picked!");
      fetchClaimedItems();
    } catch {
      toast.error("Failed to mark as picked");
    }
  };

  useEffect(() => {
    fetchClaimedItems();
  }, [fetchClaimedItems]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-green-700 font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Claimed Items</h2>
      {items.length > 0 ? (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Condition</th>
              <th className="p-2 border">Donor</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-2 border">{item.title}</td>
                <td className="p-2 border">{item.category}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">{item.condition}</td>
                <td className="p-2 border">{item.donor?.name}</td>
                <td className="border-b px-4 py-2">
                  <button
                    onClick={() => handleMarkPicked(item._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Mark as Picked
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-green-700">No claimed items available.</p>
      )}
    </div>
  );
};

export default ClaimedItems;
