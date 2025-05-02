"use client";
import React, { useState, useEffect } from "react";
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
  status: "inactive" | "available" | "requested" | "claimed" | "picked" | "donated"; // there are 4 conditions: available, claimed, picked, and donated
  isRequested: boolean;
  donor: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

const ListingTeaser = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [_totalItems, setTotalItems] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_totalPages, setTotalPages] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, _setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {isUserLoading } = useAuth();
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/items", {
          params: {
            page: currentPage,
            limit: 12,
          },
        });
        setItems(response.data.items);
        setTotalItems(response.data.totalItems);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load items.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [currentPage]);

  const statusInfo: Record<string, { color: string; message: string }> = {
    available: { color: "bg-green-500 text-white", message: "This item is available for donation." },
    requested: { color: "bg-green-500 text-white", message: "This item is available for donation." },
    claimed: { color: "bg-yellow-500 text-white", message: "This item has been claimed." },
    picked: { color: "bg-blue-500 text-white", message: "This item has been picked up." },
    donated: { color: "bg-gray-500 text-white", message: "This item has been donated." },
  };

  if (isLoading || isUserLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((item) => {
            const status = statusInfo[item.status] || statusInfo["available"];
            return (
              <div key={item._id} className="bg-card border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Link href={`/listing/${item._id}`}>
                  {item.images.length > 0 ? (
                    <Image src={item.images[0]} alt={item.title} width={240} height={180} className="w-full object-fill rounded-t-lg aspect-[4/3]" />
                  ) : (
                    <div className="w-full flex items-center justify-center bg-gray-200 text-4xl font-bold text-gray-600 rounded-t-lg aspect-[4/3]">{item.title.charAt(0).toUpperCase()}</div>
                  )}
                  <div className="p-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {item.title}
                      </h3>
                      <div className="group relative flex">
                        <div className={`px-3 py-3 text-xs font-semibold rounded-full ${status.color}`}></div>
                        <span className="absolute bottom-full right-full scale-0 translate-x-4 -translate-y-4 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap">
                          {status.message}
                        </span>
                      </div>
                    </div>
                    <p className="text-text-primary mt-2 text-sm h-10">{item.description.length > 70 ? item.description.slice(0, 70) + "..." : item.description}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
      <Link href="/listing" className="flex max-w-[240px] mx-auto text-center mt-6 justify-center font-bold  bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition">
        Check All Items
      </Link>
    </div>
  );
};

export default ListingTeaser;
