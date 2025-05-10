"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Item {
  _id: string;
  title: string;
  images: string[];
  status: string;
}

const statusInfo: Record<string, { color: string; message: string }> = {
  available: { color: "bg-green-500 text-white", message: "Available" },
  requested: { color: "bg-yellow-500 text-white", message: "Requested" },
  claimed: { color: "bg-blue-500 text-white", message: "Claimed" },
  donated: { color: "bg-gray-500 text-white", message: "Donated" },
};

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  const status = statusInfo[item.status] || { color: "bg-gray-300", message: "Unknown" };

  return (
    <Link href={`/listing/${item._id}`} className="group">
      <div className="flex flex-col bg-white border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
        {item.images.length ? (
          <Image src={item.images[0]} alt={item.title} width={400} height={300} className="w-full object-cover" />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500">No Image</div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-bold">{item.title}</h3>
          <span className={`text-sm font-medium px-2 py-1 rounded ${status.color}`}>{status.message}</span>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;