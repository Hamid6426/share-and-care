"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";

interface Item {
  _id: string;
  title: string;
  quantity: number;
  status: "claimed" | "requested"; // Item status can be claimed or requested
  receiver: { _id: string; name: string }; // Receiver details
  isRequested: boolean;
  requestAccepted: boolean;
  requestCancelled: boolean;
}

const Requests = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch requested items from the API
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get("/api/items/my-items/requested-items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const acceptRequest = async (itemId: string) => {
    try {
      await axiosInstance.put(`/api/items/my-items/${itemId}/accept-request`);
      setItems((prevItems) => prevItems.map((item) => (item._id === itemId ? { ...item, requestAccepted: true, isRequested: false } : item)));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const rejectRequest = async (itemId: string) => {
    try {
      await axiosInstance.put(`/api/items/my-items/${itemId}/reject-request`);
      setItems((prevItems) => prevItems.map((item) => (item._id === itemId ? { ...item, requestCancelled: true, isRequested: false } : item)));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Requested Items</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Item Title</th>
            <th className="border-b px-4 py-2">Quantity</th>
            <th className="border-b px-4 py-2">Receiver</th>
            <th className="border-b px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td className="border-b px-4 py-2">{item.title}</td>
              <td className="border-b px-4 py-2">{item.quantity}</td>
              <td className="border-b px-4 py-2">{item.receiver?.name}</td>
              {item.status === "claimed" ? (
                <td className="border-b px-4 py-2 flex justify-around">
                  <button
                    onClick={() => acceptRequest(item._id)}
                    disabled={item.requestAccepted || item.requestCancelled}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(item._id)}
                    disabled={item.requestAccepted || item.requestCancelled}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
                  >
                    Reject
                  </button>
                </td>
              ) : (
                <td className="border-b px-4 py-2 flex justify-around">
                  <span className="text-gray-500">Request {item.requestCancelled ? "Cancelled" : "Accepted"}</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Requests;
