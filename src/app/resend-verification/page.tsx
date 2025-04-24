"use client";

import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import Link from "next/link";

const ResendVerification: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/resend-verification", { email });
      toast.success(res.data.message || "Verification email sent.");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-300 px-4">
      <div className="w-full max-w-md bg-green-100 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Resend Verification Email</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-800 text-sm mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500 rounded-md px-3 py-2"
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-200">
            {isLoading ? "Sending..." : "Send Verification Email"}
          </button>
        </form>
        <div className="flex justify-center my-3">
          <div className="text-green-600">Already Verified?</div>
        </div>
        <div className="flex">
          <Link href="/signup" className="text-center border-green-500 border text-green-500 hover:text-green-600 font-medium py-2 px-4 rounded-md transition duration-200 w-full">
            Sign in Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
