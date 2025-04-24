// src/app/receiver-dashboard/requested-items/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

interface Item {
  _id: string;
  title: string;
  quantity: number;
  category: string;
  condition: string;
  status: string;
  donor: {
    name: string;
    email?: string;
  };
  isRequested: boolean;
  requestAccepted: boolean;
  requestCancelled: boolean;
  isPicked: boolean;
  isDonated: boolean;
}

const MyRequests = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequestedItems = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/items/receiver/requested-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(res.data.items || []);
    } catch {
      toast.error("Failed to fetch requested items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestedItems();
  }, [fetchRequestedItems]);

  const removeRequest = async (itemId: string) => {
    try {
      await axiosInstance.post(`/api/items/${itemId}/receiver-actions/remove-request`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Request removed successfully");
      fetchRequestedItems();
    } catch {
      toast.error("Failed to remove request");
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-green-700 font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Requested Items</h2>
      {items.length > 0 ? (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Condition</th>
              <th className="p-2 border">Donor</th>
              <th className="p-2 border">Email</th>
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
                <td className="p-2 border">{item.donor?.name || "N/A"}</td>
                <td className="p-2 border">{item.donor?.email || "N/A"}</td>
                <td className="border-b px-4 py-2 flex justify-around">
                  {!item.isPicked && (
                    <button
                      onClick={() => removeRequest(item._id)}
                      disabled={item.requestCancelled || item.isPicked}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
                    >
                      Remove Request
                    </button>
                  )}
                  {item.isPicked && (
                    <span className="text-green-700 font-semibold">Picked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-green-700">No requested items found.</p>
      )}
    </div>
  );
};

export default MyRequests;
