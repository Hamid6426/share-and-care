"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import SkeletonCard from "@/components/SkeletonCard";
import { useItems } from "../contexts/ItemsContext";

const statusInfo: Record<string, { color: string; message: string }> = {
  available: {
    color: "bg-green-500 text-white",
    message: "This item is available for donation.",
  },
  requested: {
    color: "bg-green-500 text-white",
    message: "This item is available for donation.",
  },
  claimed: {
    color: "bg-yellow-500 text-white",
    message: "This item has been claimed.",
  },
  picked: {
    color: "bg-blue-500 text-white",
    message: "This item has been picked up.",
  },
  donated: {
    color: "bg-gray-500 text-white",
    message: "This item has been donated.",
  },
};

const ListingTeaser: React.FC = () => {
  const { items, isLoading: itemsLoading } = useItems();
  const { isUserLoading } = useAuth();

  // Show only the first 8 items for the teaser
  const teaserItems = items.slice(0, 8);

  // Loading state: either context is loading or auth is loading
  if (itemsLoading || isUserLoading) {
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      {teaserItems.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teaserItems.map((item) => {
            const status = statusInfo[item.status] || statusInfo.available;
            return (
              <div
                key={item._id}
                className="bg-card border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Link href={`/listing/${item._id}`}>
                  {item.images.length > 0 ? (
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
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/listing"
        className="flex max-w-[240px] mx-auto text-center mt-6 justify-center font-bold bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
      >
        Check All Items
      </Link>
    </div>
  );
};

export default ListingTeaser;
