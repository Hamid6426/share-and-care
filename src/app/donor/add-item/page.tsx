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
    category: "",
    condition: "used", // Default value to "used"
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
      // router.push(`/donor/my-items/${itemId}/add-images`); // Redirect to detail page no redirect since there is a second step for uploading pictures
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-green-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-800">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Item title" required className="w-full px-4 py-2 border border-green-500 rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Item description" required className="w-full px-4 py-2 border border-green-500 rounded" />
        <input
          name="category"
          type="text"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category (e.g. clothes, electronics)"
          className="w-full px-4 py-2 border border-green-500 rounded"
        />
        
        {/* Condition Dropdown */}
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-green-500 rounded"
        >
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="poor">Poor</option>
        </select>

        <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
          {isSubmitting ? "Submitting…" : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
