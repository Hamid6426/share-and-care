"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import SkeletonCard from "@/components/SkeletonCard";
import { useItems } from "../contexts/ItemsContext";
import ItemFilters from "./ItemFilters";
import { MdInfoOutline, MdLocationPin } from "react-icons/md";

const categoryOptions = [
  "Clothes",
  "Books",
  "Food",
  "Electronics",
  "Furniture",
  "Stationary",
  "Toys",
  "Other",
];

const statusInfo = {
  available: {
    name: "Available",
    color: "border-2 border-green-500 text-green-500",
    message: "Available",
  },
  claimed: {
    name: "Claimed",
    color: "border-2 border-orange-500 text-orange-500",
    message: "Claimed",
  },
  picked: {
    name: "Picked",
    color: "border-2 border-purple-500 text-purple-500",
    message: "Donated",
  },
};

const ItemListing: React.FC = () => {
  const { isUserLoading } = useAuth();
  const { items, currentPage, totalPages, setCurrentPage, isLoading } =
    useItems();

  // Filters state lifted here
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedStatuses: new Set(Object.keys(statusInfo)),
    selectedPriceFilters: new Set(["free", "not-free"]),
    selectedCategories: new Set(categoryOptions),
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      const matchesStatus = filters.selectedStatuses.has(item.status);
      const isFree = item.price === 0;
      const matchesPrice =
        (isFree && filters.selectedPriceFilters.has("free")) ||
        (!isFree && filters.selectedPriceFilters.has("not-free"));
      const matchesCategory = filters.selectedCategories.has(
        item.category.charAt(0).toUpperCase() + item.category.slice(1)
      );

      return matchesSearch && matchesStatus && matchesPrice && matchesCategory;
    });
  }, [items, filters]);

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

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const displayItems = filteredItems.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto p-6 mt-4">
      {/* Filters */}
      <ItemFilters
        categoryOptions={categoryOptions}
        statusInfo={statusInfo}
        onFiltersChange={setFilters}
        initialFilters={filters}
      />

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <p className="flex flex-col justify-center items-center gap-4 text-center text-gray-500 border w-full py-32 rounded-xl">
          <MdInfoOutline size={80} className="text-red-400" />
          <div className="text-xl">No items match your filters so kindly select different options</div>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item) => {
            const status =
              statusInfo[item.status as keyof typeof statusInfo] ??
              statusInfo.available;

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
                  <div className="w-full aspect-[4/3] flex items-center gap-3 justify-center flex-col bg-gray-50 font-medium text-gray-500">
                     <MdInfoOutline size={40} className="text-red-400" />
                     <div className="text-sm">No image is uploaded for this item</div>
                  </div>
                )}

                <div className="flex-1 px-4 pt-2 py-4 flex flex-col justify-between">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex justify-between mt-3">
                    <span
                      className={`text-sm px-5 py-1 rounded-md ${
                        item.price === 0
                          ? "text-green-500 border-2 border-green-500"
                          : "text-red-500 border-2 border-red-500"
                      }`}
                    >
                      {item.price === 0 ? "Free" : "Not Free"}
                    </span>
                    <span className="py-1 font-semibold text-blue-500">
                      {item.category}
                    </span>
                  </div>

                  <div className="overflow-hidden h-12 mt-2 text-gray-600">
                    {truncateText(item.description, 60)}
                  </div>

                  <div className="flex justify-between mt-2">
                    <div className="py-[6px] flex items-center gap-1">
                      <MdLocationPin size={18} />
                      <div className="text-sm text-purple-500">{item.donor.city}</div>
                    </div>
                    <span
                      className={`text-sm px-4 py-[6px] rounded-md ${status.color}`}
                    >
                      {status.message}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
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
