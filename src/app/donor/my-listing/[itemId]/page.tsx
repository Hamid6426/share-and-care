"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";
import Link from "next/link";

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: "new" | "used" | "poor";
  images: string[];
  quantity: number;
  status: "available" | "claimed" | "picked-up" | "donated";
  donor: { name: string; email: string };
  receiver?: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

const statusBadge: Record<Item["status"], string> = {
  available: "bg-[var(--color-secondary)] text-white",
  claimed:   "bg-[var(--color-accent)] text-white",
  "picked-up":"bg-[var(--color-primary)] text-white",
  donated:   "bg-[var(--color-accent)] text-white",
};

export default function MyItemPreview() {
  const { itemId } = useParams() as { itemId: string };
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/api/items/${itemId}`);
        setItem(data);
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [itemId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <p className="text-[var(--color-text-primary)]">Loading item…</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <p className="text-[var(--color-text-primary)]">Item not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4 bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto bg-[var(--color-card)] rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--color-primary)] px-6 py-4">
          <h1 className="text-2xl font-bold text-white text-center">
            Item Details
          </h1>
        </div>

        {/* Content */}
        <div className="md:flex">
          {/* Gallery */}
          <div className="md:w-1/2 p-4">
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, idx) => {
                const url = item.images[idx];
                return url ? (
                  <Image
                    key={idx}
                    src={url}
                    alt={`${item.title} image ${idx + 1}`}
                    width={300}
                    height={225}
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div
                    key={idx}
                    className="w-full h-40 bg-[var(--color-background)] border border-gray-200 rounded flex items-center justify-center text-gray-400"
                  >
                    No Image
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {item.title}
              </h2>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded ${statusBadge[item.status]}`}
              >
                {item.status.replace("-", " ").toUpperCase()}
              </span>
              <p className="text-[var(--color-text-primary)]">
                {item.description}
              </p>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="font-semibold text-[var(--color-text-primary)]">
                    Category
                  </dt>
                  <dd>{item.category}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--color-text-primary)]">
                    Condition
                  </dt>
                  <dd>{item.condition}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--color-text-primary)]">
                    Quantity
                  </dt>
                  <dd>{item.quantity}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--color-text-primary)]">
                    Donor
                  </dt>
                  <dd>{item.donor.name}</dd>
                </div>
                {item.receiver && (
                  <div>
                    <dt className="font-semibold text-[var(--color-text-primary)]">
                      Receiver
                    </dt>
                    <dd>{item.receiver.name}</dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-[var(--color-text-primary)]">
                    Created
                  </dt>
                  <dd>
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/donor/my-listing"
                className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-primary)] text-[var(--color-primary)] rounded hover:bg-[var(--color-primary)] hover:text-white transition"
              >
                ← Back to Listings
              </Link>
              <button
                onClick={() =>
                  router.push(`/donor/my-listing/${item._id}/edit`)
                }
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-accent)] transition"
              >
                Edit Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
