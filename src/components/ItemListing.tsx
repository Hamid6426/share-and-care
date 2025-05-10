"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import SkeletonCard from "@/components/SkeletonCard";
import { useItems } from "../contexts/ItemsContext";

const statusInfo: Record<
  string,
  { name: string; color: string; message: string }
> = {
  available: {
    name: "Available",
    color: "bg-green-500 text-white",
    message: "This item is available for donation.",
  },
  requested: {
    name: "available", // intentional available
    color: "bg-green-500 text-white",
    message: "This item is available for donation.",
  },
  claimed: {
    name: "Claimed",
    color: "bg-yellow-500 text-white",
    message: "This item has been claimed.",
  },
  picked: {
    name: "Picked",
    color: "bg-blue-500 text-white",
    message: "This item has been picked up.",
  },
  donated: {
    name: "Donated",
    color: "bg-gray-500 text-white",
    message: "This item has been donated.",
  },
};

const ItemListing: React.FC = () => {
  const { isUserLoading } = useAuth();
  const { items, currentPage, totalPages, setCurrentPage, isLoading } =
    useItems();

  // 1. Search term state
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Status filter state as a Set for quick lookup
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    () => new Set(Object.keys(statusInfo))
  );

  // 3. Memoized filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatuses.has(item.status);
      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, selectedStatuses]);

  // 4. Handler for toggling status checkboxes
  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  // Decide which items to actually render (max 8)
  const displayItems = filteredItems.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto p-6 mt-4">
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex gap-2 w-full">
          {/* Status Checkboxes */}
          <div className="flex flex-nowrap gap-3">
            {Object.entries(statusInfo).map(([status, { name }]) => (
              <label
                key={status}
                className="inline-flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.has(status)}
                  onChange={() => toggleStatus(status)}
                  className="form-checkbox h-5 w-5 rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-gray-700 text-sm">{name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-500">
          No items match your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Render the real items */}
          {displayItems.map((item) => {
            const status = statusInfo[item.status] ?? statusInfo.available;
            return (
              <Link
                key={item._id}
                href={`/listing/${item._id}`}
                className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
              >
                {item.images.length ? (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-100 font-medium text-gray-500">
                    No Image uploaded
                  </div>
                )}

                <div className="flex-1 px-2 py-2 flex flex-col justify-between">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <span
                    className={`mt-2 inline-flex items-center gap-3 text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                    {status.message}
                  </span>
                </div>
              </Link>
            );
          })}

          {/*   <div>
          {Array.from({ length: placeholdersCount }).map((_, idx) => (
         <div className="rounded-2xl">
              <div
                key={`placeholder-${idx}`}
                className="bg-gray-50 border border-gray-200 aspect-[4/3] rounded-t-2xl"
              />
              <div className="flex-1 px-2 py-2 flex flex-col justify-between shadow-lg rounded-2xl">
                <h3 className="opacity-0  text-lg bg-gray font-bold text-gray-900 line-clamp-1">
                  {" "}
                </h3>
                <span
                  className={`opacity-0 mt-2 inline-flex items-center gap-3 text-xs font-semibold px-3 py-1  shadow md:shadow-md`}
                >
                  {" "}
                  <span className="h-2 w-2 rounded-full bg-white"> </span>-
                </span>
              </div>
            </div> 
          ))}
          </div>*/}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center space-x-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-primary cursor-pointer text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-primary cursor-pointer text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ItemListing;
