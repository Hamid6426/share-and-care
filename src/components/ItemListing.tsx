"use client";

import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/utils/axiosInstance";

interface Item {
  _id: string;
  title: string;
  description: string;
  quantity: number;
  images: string[];
  status: "inactive" | "available" | "requested" | "claimed" | "picked" | "donated";
  isRequested: boolean;
  donor: { _id: string; name: string; email: string };
  receiver: { _id: string; name: string; email: string } | null;
}

const fetchItems = async (key: string, page: number) => {
  const { data } = await axiosInstance.get("/api/items", {
    params: { page, limit: 12 },
  });
  return data;
};

const statusInfo: Record<string, { color: string; message: string }> = {
  available: { color: "bg-green-500 text-white", message: "This item is available for donation." },
  requested: { color: "bg-green-500 text-white", message: "This item is available for donation." },
  claimed:   { color: "bg-yellow-500 text-white", message: "This item has been claimed." },
  picked:    { color: "bg-blue-500 text-white",   message: "This item has been picked up." },
  donated:   { color: "bg-gray-500 text-white",   message: "This item has been donated." },
};

const ItemListing: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser, isUserLoading } = useAuth();

  const { data, error, isLoading } = useSWR(
    ["items", currentPage],
    fetchItems,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,    // 1 minute
      keepPreviousData: true,
    }
  );

  // Prefetch next page for snappier pagination
  useEffect(() => {
    if (data?.totalPages && currentPage < data.totalPages) {
      mutate(["items", currentPage + 1], fetchItems("items", currentPage + 1));
    }
  }, [currentPage, data]);

  if (isLoading || isUserLoading) return <p className="text-center">Loading...</p>;
  if (error) {
    console.error(error);
    toast.error("Failed to load items.");
    return <p className="text-center text-red-500">Failed to load items.</p>;
  }

  const items: Item[] = data.items;
  const totalPages: number = data.totalPages;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-4">
      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const status = statusInfo[item.status] ?? statusInfo.available;
            return (
              <div
                key={item._id}
                className="bg-card border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Link href={`/listing/${item._id}`}>
                  {item.images.length ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      width={240}
                      height={180}
                      className="w-full object-fill rounded-t-lg aspect-[4/3]"
                    />
                  ) : (
                    <div className="w-full flex items-center justify-center bg-gray-200 text-4xl font-bold text-gray-600 rounded-t-lg aspect-[4/3]">
                      {item.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="p-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {item.title}
                      </h3>
                      <div className="group relative flex">
                        <div
                          className={`px-3 py-3 text-xs font-semibold rounded-full ${status.color}`}
                        />
                        <span className="absolute bottom-full right-full scale-0 translate-x-4 -translate-y-4 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap">
                          {status.message}
                        </span>
                      </div>
                    </div>
                    <p className="text-text-primary mt-2 text-sm h-10">
                      {item.description.length > 70
                        ? `${item.description.slice(0, 70)}…`
                        : item.description}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex justify-center items-center space-x-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ItemListing;
