"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

const AcceptedItems = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClaimedItems = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/items/receiver/received-items", {
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
    fetchClaimedItems();
  }, [fetchClaimedItems]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Received Items</h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No accepted items yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item: any) => (
            <li key={item._id} className="p-4 border rounded bg-green-50">
              <h3 className="font-semibold text-green-800">{item.title}</h3>
              <p>Receiver: {item.receiver?.name}</p>
              <p>Email: {item.receiver?.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcceptedItems;
