"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

const AvailableItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/items/donor/items-by-status?status=available`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setItems(res.data.items || []);
      } catch {
        toast.error("Failed to fetch available items");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Available (Rejected) Items</h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No available/rejected items.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item: any) => (
            <li key={item._id} className="p-4 border rounded bg-green-50">
              <h3 className="font-semibold text-green-800">{item.title}</h3>
              <p>Category: {item.category}</p>
              <p>Status: <span className="text-yellow-600 font-medium">Available</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailableItems;
