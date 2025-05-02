"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { toast } from "react-toastify";

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
  };
  receiver?: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  isAccepted: boolean;
  isClaimed: boolean;
  isPicked: boolean;
  isDonated: boolean;
  isCancelled: boolean;
  isRequested: boolean;
  requestAccepted: boolean;
  requestCancelled: boolean;
};

const PublicItemDetails = () => {
  const { itemId } = useParams() as { itemId: string };
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/items/${itemId}`);
        setItem(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [itemId]);

  const handleRequest = async () => {
    if (!item) return;
    setRequesting(true);
    setRequestError("");

    try {
      await axiosInstance.post(`/api/items/${item._id}/receiver-actions/make-request`);
      toast.success("Request sent successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to send request");
    } finally {
      setRequesting(false);
    }
  };

  useEffect(() => {
    if (requestError) {
      toast.error(requestError);
    }
  }, [requestError]);

  if (loading) return <p className="text-center py-10">Loading item...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!item) return <p className="text-center">Item not found.</p>;

  return (
    <div className="mt-6 flex w-full flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Image Section */}
      {/* Image Section */}
      <div className="flex w-full gap-3">
        {/* Main Image */}
        <div className="aspect-[4/3] relative w-[80%] bg-orange-100 rounded shadow-soft">
          {item.images[0] ? (
            <Image src={item.images[0]} alt="Main item image" fill className="object-cover rounded shadow-soft" />
          ) : (
            <div className="w-full h-full animate-pulse bg-orange-100 rounded" />
          )}
        </div>

        {/* Thumbnails: Always show 3 slots (images or empty boxes) */}
        <div className="w-[20%] h-full flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, idx) => {
            const src = item.images[idx + 1]; // Skip main image at index 0
            return (
              <div key={idx} className="relative aspect-square w-full bg-orange-100 rounded shadow-soft">
                {src ? <Image src={src} alt={`Thumbnail ${idx + 1}`} fill className="object-cover rounded shadow-soft" /> : <div className="w-full h-full animate-pulse bg-orange-100 rounded" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <Link className="text-white bg-primary w-[200px] text-center py-2 px-2 rounded font-bold hover:bg-accent" href={`/${item.donor._id}`}>
          Contact
        </Link>
        <button
          onClick={handleRequest}
          disabled={requesting || item.isRequested}
          className={`py-2 px-4 rounded w-[200px] text-white font-bold ${requesting || item.isRequested ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-accent cursor-pointer"}`}
        >
          {requesting ? "Requesting..." : item.isRequested ? "Already Requested" : "Request Item"}
        </button>
      </div>

      {/* Details Section */}
      <div className="bg-card p-6 rounded-md shadow-soft w-full">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold mb-2 text-text-primary">{item.title}</h2>
          <p className="text-text-primary">{item.description}</p>

          <DetailRow label="Category" value={item.category} />
          <DetailRow label="Condition" value={item.condition} />
          <DetailRow label="Quantity" value={String(item.quantity)} />
          <DetailRow label="Listed By" value={item.donor.name} />
        </div>
      </div>
    </div>
  );
};

// Subcomponent for detail rows
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex w-full">
    <h3 className="py-2 pl-4 shadow-soft w-full bg-primary font-bold text-white">{label}</h3>
    <p className="py-2 pl-4 shadow-soft w-full text-text-primary">{value}</p>
  </div>
);

export default PublicItemDetails;
