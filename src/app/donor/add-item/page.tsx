"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const AddItem = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 1,
    category: "",
    condition: "used",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return <p className="text-center py-10 text-red-600 font-semibold">Please log in to add items.</p>;
  }

  if (currentUser.role !== "donor") {
    return <p className="text-center py-10 text-yellow-600 font-semibold">Only donors can add donation items.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to add an item.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/api/items", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const itemId = res.data._id;
      toast.success("Item created!");
      router.push(`/donor/my-items/${itemId}/edit`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-xl mx-auto p-6 bg-green-100 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-green-800">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium text-green-900">
              Title
            </label>
            <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border border-green-500 rounded" placeholder="Item title" />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium text-green-900">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-green-500 rounded"
              placeholder="Item description"
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-green-800 text-sm mb-1">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              min={1}
              className="w-full px-4 py-2 border border-green-500 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block mb-1 font-medium text-green-900">
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-green-500 rounded"
              placeholder="e.g. clothes, electronics"
            />
          </div>

          <div>
            <label htmlFor="condition" className="block mb-1 font-medium text-green-900">
              Condition
            </label>
            <select id="condition" name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-2 border border-green-500 rounded">
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
            {isSubmitting ? "Submitting…" : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
