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
      const res = await axiosInstance.get(
        `/api/items/donor/items-by-status?status=${status}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
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
      await axiosInstance.post(
        `/api/items/${itemId}/donor-actions/accept-request`
      );
      toast.success("Request accepted");
      fetchItemsByStatus("requested");
    } catch {
      toast.error("Failed to accept request");
    }
  };

  const rejectRequest = async (itemId: string) => {
    try {
      await axiosInstance.post(
        `/api/items/${itemId}/donor-actions/reject-request`
      );
      toast.info("Request rejected");
      fetchItemsByStatus("requested");
    } catch {
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-primary text-center">
        Requested Items
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center w-full border-2 bg-card border-gray-200 rounded-lg aspect-16/8 my-6">
          <p className="text-center shadow-soft aspect-16/8 px-8 bg-card rounded-lg flex items-center justify-center">
            No requested items found.
          </p>
        </div>
      ) : (
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-green-100 text-primary">
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
                  <button
                    onClick={() => acceptRequest(item._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="grid grid-cols-2 gap-6 text-center">
        <Link
          href="/donor/accepted-items"
          className=" bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          Accepted Items
        </Link>
        <Link
          href="/donor/rejected-items"
          className=" bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          Rejected Items
        </Link>
      </div>
    </div>
  );
};

export default RequestedItems;
