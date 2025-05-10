"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import Image from "next/image";

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  images: string[];
  quantity: number;
  status: "available" | "requested" | "claimed" | "picked" | "donated";
  donor: { _id: string; name: string; email: string };
  receiver:
    | { _id: string; name: string; email: string }
    | null;
}

const statusStyles: Record<Item["status"], string> = {
  available: "bg-[var(--color-secondary)] text-white",
  requested: "bg-[var(--color-accent)] text-white",
  claimed: "bg-yellow-800 text-white",
  picked: "bg-blue-600 text-white",
  donated: "bg-green-600 text-white",
};

const MyListing = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          "/api/items/donor/listed-items",
          {
            params: { page: currentPage, limit: 12 },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setItems(response.data.items);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-[var(--color-background)]">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">
        My Items
      </h2>

      {isLoading ? (
        <p className="text-center text-[var(--color-text-primary)]">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => {
            const firstImage = item.images[0];
            return (
              <div
                key={item._id}
                className="bg-[var(--color-card)] border border-gray-200 rounded-lg shadow p-6 flex flex-col md:flex-row gap-4"
              >
                {/* Image or placeholder */}
                <div className="flex-shrink-0">
                  {firstImage ? (
                    <Image
                      src={firstImage}
                      alt={item.title}
                      width={240}
                      height={180}
                      className="w-[240px] h-[180px] object-cover rounded"
                    />
                  ) : (
                    <div className="w-[240px] h-[180px] bg-gray-100 rounded flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                      {item.title}
                    </h3>
                    <div className="mt-1 flex items-center flex-wrap gap-2">
                      <span className="text-sm text-gray-500">
                        {item.category}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[item.status]}`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-3 text-[var(--color-text-primary)]">
                      {item.description}
                    </p>
                    <div className="mt-4 text-sm text-[var(--color-text-primary)] space-y-1">
                      <p>
                        <strong>Donor:</strong> {item.donor.name} (
                        {item.donor.email})
                      </p>
                      {item.receiver && (
                        <p>
                          <strong>Receiver:</strong> {item.receiver.name} (
                          {item.receiver.email})
                        </p>
                      )}
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/donor/my-listing/${item._id}`}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white font-medium rounded hover:bg-[var(--color-accent)] transition"
                    >
                      Preview
                    </Link>
                    <Link
                      href={`/donor/my-listing/${item._id}/edit`}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white font-medium rounded hover:bg-[var(--color-accent)] transition"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/donor/my-listing/${item._id}/add-pictures`}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white font-medium rounded hover:bg-[var(--color-accent)] transition"
                    >
                      Add Pictures
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {items.length > 0 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded font-medium transition disabled:opacity-50 bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)]"
          >
            Previous
          </button>
          <span className="text-[var(--color-text-primary)] font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded font-medium transition disabled:opacity-50 bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyListing;
