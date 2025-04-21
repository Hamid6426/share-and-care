"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  images: string[];
  quantity: number;
  status: string;
  donor: {
    name: string;
    email: string;
  };
  receiver: {
    name: string;
    email: string;
  };
}

const MyItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/items/my-items", {
          params: {
            page: currentPage,
            limit: 12,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-800">My Items</h2>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500">No items found.</p>
            ) : (
              items.map((item) => (
                <div key={item._id} className="border p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.category} - {item.status}
                  </p>
                  <p className="text-base">{item.description}</p>
                  <p className="mt-2 text-sm">
                    <strong>Donor:</strong> {item.donor.name} ({item.donor.email})
                  </p>
                  {item.receiver && (
                    <p className="mt-1 text-sm">
                      <strong>Receiver:</strong> {item.receiver.name} ({item.receiver.email})
                    </p>
                  )}
                  <p className="mt-2 text-sm">
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <Link href={`/donor/my-items/${item._id}`}>Edit Item</Link>

                  {item.images.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-semibold">Images:</h4>
                      <div className="flex space-x-2">
                        {item.images.map((image, index) => (
                          <img key={index} src={image} alt={`Image ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400">
              Previous
            </button>
            <span className="self-center text-lg font-semibold">
              {currentPage} / {totalPages}
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

export default MyItems;
