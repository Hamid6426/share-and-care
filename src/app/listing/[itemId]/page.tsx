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
      router.refresh(); // Refresh the page to reflect the updated item details
    } catch (err: any) {
      setRequestError(err.response?.data?.error || err.message || "Failed to send request");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading item...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!item) return <p className="text-center">Item not found.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Item Details</h1>
      <div className="mt-4">
        {loading || item.images.length === 0 ? (
          <div className="w-full flex gap-3">
            <div className="w-[80%] aspect-[4/3] bg-green-200 animate-pulse rounded-md border border-green-300" />
            <div className="flex flex-col items-center gap-3 w-[20%] h-full">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="aspect-square w-full bg-green-100 animate-pulse rounded-md border border-green-300" />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full flex gap-3">
            <div className="w-full aspect-[4/3] relative">
              <Image src={item.images[0]} alt="Main item image" fill className="object-cover rounded-md border border-green-300 shadow" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {item.images.slice(1, 4).map((src: string, idx: number) => (
                <div key={idx} className="relative aspect-square">
                  <Image src={src} alt={`Thumbnail ${idx + 1}`} fill className="object-cover rounded-md border border-green-300 shadow-sm" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
          <button
            onClick={handleRequest}
            disabled={requesting || item.isRequested}
            className={`py-2 px-4 mb-2 rounded text-white font-bold hover:bg-green-600 cursor-pointer ${requesting || item.isRequested ? " disabled:bg-gray-500 cursor-not-allowed" : "bg-green-500"}`}
          >
            {requesting ? "Requesting..." : item.isRequested ? "Already Requested" : "Request Item"}
          </button>
        </div>
        {requestError && <p className="text-red-500 mt-2">{requestError}</p>}
        <p>{item.description}</p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex flex-col justify-center items-center text-center w-full gap-2">
            <h3 className="py-2 border w-full">Category</h3>
            <p className="py-2 border w-full">{item.category}</p>
          </div>
          <div className="flex flex-col justify-center items-center text-center w-full gap-2">
            <h3 className="py-2 border w-full">Condition</h3>
            <p className="py-2 border w-full">{item.condition}</p>
          </div>
          <div className="flex flex-col justify-center items-center text-center w-full gap-2">
            <h3 className="py-2 border w-full">Quantity</h3>
            <p className="py-2 border w-full">{item.quantity}</p>
          </div>
        </div>

        <div className="font-semibold mt-4">
          Listed By -{" "}
          <Link className="text-green-500 hover:text-green-600" href={`/${item.donor._id}`}>
            {item.donor.name}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicItemDetails;
