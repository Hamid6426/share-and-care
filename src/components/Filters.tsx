"use client";

import React, { useState } from "react";

interface FiltersProps {
  onFilter: (filters: {
    category?: string;
    condition?: string;
    status?: string;
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilter }) => {
  const [category, setCategory] = useState<string | undefined>();
  const [condition, setCondition] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();

  const handleFilter = () => {
    onFilter({ category, condition, status });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={category || ""}
          onChange={(e) => setCategory(e.target.value || undefined)}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        >
          <option value="">All Categories</option>
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="books">Books</option>
          <option value="toys">Toys</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Condition
        </label>
        <select
          value={condition || ""}
          onChange={(e) => setCondition(e.target.value || undefined)}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        >
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={status || ""}
          onChange={(e) => setStatus(e.target.value || undefined)}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="requested">Requested</option>
          <option value="claimed">Claimed</option>
          <option value="picked">Picked</option>
          <option value="donated">Donated</option>
        </select>
      </div>

      <button
        onClick={handleFilter}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;