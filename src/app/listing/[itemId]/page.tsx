"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { toast } from "react-toastify";
import { MdArrowRight } from "react-icons/md";

type Item = {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  images: string[];
  quantity: number;
  donor: {
    _id: string;
    name: string;
    email: string;
    country: string;
    state: string;
    city: string;
  };
  receiver?: {
    _id: string;
    name: string;
    email: string;
    country: string;
    state: string;
    city: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  isRequested: boolean;
};

export default function PublicItemDetails() {
  const { itemId } = useParams() as { itemId: string };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/items/${itemId}`);
        setItem(res.data);
        setCurrentImageIndex(0);
      } catch (err: any) {
        setError(
          err.response?.data?.error || err.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [itemId]);

  const handleRequest = async () => {
    if (!item) return;
    setRequesting(true);
    try {
      await axiosInstance.post(
        `/api/items/${item._id}/receiver-actions/make-request`
      );
      toast.success("Request sent successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || err.message || "Failed to send request"
      );
    } finally {
      setRequesting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <p className="text-[var(--color-text-primary)]">Loading item…</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  if (!item)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <p className="text-[var(--color-text-primary)]">Item not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto bg-[var(--color-card)] rounded-lg shadow-soft overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--color-primary)] px-6 py-3">
          <h1 className="text-center text-2xl font-bold text-white">
            {item.title}
          </h1>
        </div>

        {/* Gallery */}
        <div className="p-6">
          {/* Main image */}
          <div className="relative w-full aspect-[4/3] rounded overflow-hidden bg-[var(--color-background)] shadow-inner mb-4 flex items-center justify-center">
            {item.images[currentImageIndex] ? (
              <Image
                src={item.images[currentImageIndex]}
                alt="Main item image"
                fill
                className="object-contain"
              />
            ) : (
              <div className="text-gray-400">No Image</div>
            )}

            {/* Left Arrow */}
            {item.images.length > 1 && (
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? item.images.length - 1 : prev - 1
                  )
                }
                className="absolute -left-0 bg-black/10 text-white p-[0.1rem] rounded-full hover:bg-black/50"
              >
                <MdArrowRight
                  size={52}
                  className="rotate-180 hover:text-primary cursor-pointer"
                />
              </button>
            )}

            {/* Right Arrow */}
            {item.images.length > 1 && (
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === item.images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-0 bg-black/10 text-white p-[0.1rem] rounded-full hover:bg-black/50"
              >
                <MdArrowRight
                  size={52}
                  className="hover:text-primary cursor-pointer"
                />
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 flex flex-col sm:flex-row text-sm md:text-base justify-center gap-4 pb-4">
          <Link
            href={`/${item.donor._id}`}
            className="w-full sm:w-auto px-6 py-2 text-center font-bold rounded bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] transition"
          >
            Contact Donor
          </Link>
          <button
            onClick={handleRequest}
            disabled={requesting || item.isRequested}
            className={`w-full sm:w-auto px-6 py-2 font-bold rounded text-white transition ${
              requesting || item.isRequested
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-[var(--color-accent)]"
            }`}
          >
            {requesting
              ? "Requesting…"
              : item.isRequested
              ? "Already Requested"
              : "Request Item"}
          </button>
        </div>

        {/* Description */}
        <div className="px-4 pb-4">
          <h2 className="text-lg bg-primary px-4 py-2 rounded-md font-semibold text-[var(--color-card)]">
            Description
          </h2>
          <p className="bg-card shadow-md px-4 py-2 rounded-md leading-relaxed text-[var(--color-text-primary)]">
            {item.description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="px-4 pb-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-[var(--color-text-primary)]">
            <Detail term="Category" detail={item.category} />
            <Detail term="Condition" detail={item.condition} />
            <Detail term="Quantity" detail={String(item.quantity)} />
            <Detail term="Address" detail={item.donor.city + ", " + item.donor.state + ", " + item.donor.country} />
            <Detail term="Donor" detail={item.donor.name} />

            <Detail
              term="Listed On"
              detail={new Date(item.createdAt).toLocaleDateString()}
            />
            <Detail
              term="Last Updated"
              detail={new Date(item.updatedAt).toLocaleDateString()}
            />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Detail({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className="font-semibold text-card bg-primary px-4 py-2 rounded-md">
        {term}
      </dt>
      <dd className="mt-1 bg-card shadow-md px-4 py-2 rounded-md">{detail}</dd>
    </div>
  );
}
