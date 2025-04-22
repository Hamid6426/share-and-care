"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  images: string[];
  quantity: number;
  status: string; // there are 4 conditions: available, claimed, picked, and donated
  donor: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    name: string;
    email: string;
  };
}

const ItemListing = () => {
  const [items, setItems] = useState<Item[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/items", {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const statusInfo: Record<string, { color: string; message: string }> = {
    available: { color: "bg-green-500 text-green-800", message: "This item is available for donation." },
    claimed: { color: "bg-yellow-500 text-yellow-800", message: "This item has been claimed." },
    picked: { color: "bg-blue-500 text-blue-800", message: "This item has been picked up." },
    donated: { color: "bg-gray-500 text-gray-800", message: "This item has been donated." },
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6 text-green-800 text-center">Item Listings</h2>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          {items.length === 0 ? (
            <p className="text-center text-gray-500">No items found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                const status = statusInfo[item.status] || statusInfo["available"];
                return (
                  <div key={item._id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    {item.images.length > 0 ? (
                      <Image src={item.images[0]} alt={item.title} width={320} height={180} className="w-full h-48 object-cover rounded-t-lg" />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-4xl font-bold text-gray-600 rounded-t-lg">{item.title.charAt(0).toUpperCase()}</div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.title} ({item.quantity}x)
                        </h3>
                        <div className="group relative flex">
                          <div className={`px-3 py-3 text-xs font-semibold rounded-full ${status.color}`}></div>
                          <span className="absolute bottom-full right-full scale-0 translate-x-4 -translate-y-4 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap">
                            {status.message}
                          </span>
                        </div>
                      </div>
                      <p className="text-base text-gray-700 my-2">{item.description}</p>
                      <Link href={item.donor._id} className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200 font-bold">
                        Contact {item.donor.name}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex justify-center items-center space-x-4">
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400">
              Previous
            </button>
            <span className="text-lg font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemListing;
