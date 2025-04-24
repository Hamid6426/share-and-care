"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import Link from "next/link";

const RequestedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItemsByStatus = async (status: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/items/donor/items-by-status?status=${status}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setItems(res.data.items || []);
    } catch {
      toast.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemsByStatus("requested");
  }, []);

  const acceptRequest = async (itemId: string) => {
    try {
      await axiosInstance.post(`/api/items/${itemId}/donor-actions/accept-request`);
      toast.success("Request accepted");
      fetchItemsByStatus("requested");
    } catch {
      toast.error("Failed to accept request");
    }
  };

  const rejectRequest = async (itemId: string) => {
    try {
      await axiosInstance.post(`/api/items/${itemId}/donor-actions/reject-request`);
      toast.info("Request rejected");
      fetchItemsByStatus("requested");
    } catch {
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Requested Items</h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No requested items found.</p>
      ) : (
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Condition</th>
              <th className="p-3 border">Receiver</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item._id} className="border-t">
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{item.condition}</td>
                <td className="p-2">{item.receiver?.name}</td>
                <td className="p-2">{item.receiver?.email}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => acceptRequest(item._id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:bg-gray-300">
                    Accept
                  </button>
                  <button onClick={() => rejectRequest(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:bg-gray-300">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <Link href="/donor/my-listing" className="text-sm mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          My Listings
        </Link>
        <Link href="/donor/accepted-items" className="text-sm  mt-4 ml-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Accepted Items
        </Link>
        <Link href="/donor/rejected-items" className="text-sm  mt-4 ml-4 inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Rejected Items
        </Link>
      </div>
    </div>
  );
};

export default RequestedItems;
