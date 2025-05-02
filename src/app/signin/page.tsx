"use client";

import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const Signin: React.FC = () => {
  const router = useRouter();
  const { loadUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/login", formData);
      const token = res.data.token;
      localStorage.setItem("token", token);

      await loadUserProfile();
      toast.success("Login successful!");

      router.push("/listing");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh_-_4rem)] px-4">
      <div className="w-full max-w-md bg-card shadow-soft rounded-lg p-8">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-text-primary text-sm mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-text-primary text-sm mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md px-3 py-2"
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-accent text-white font-medium py-2 px-4 rounded-md transition duration-200">
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="flex justify-center mt-3">
          Haven&apos;t created an account?&nbsp;
          <Link href="/signup" className="text-primary font-bold hover:text-accent transition duration-200">
            Create Account
          </Link>
        </div>

        <div className="flex justify-center mt-3">
          Still Not Verified Yet?&nbsp;
          <Link href="/resend-verification" className="text-primary font-bold hover:text-accent transition duration-200">
            Click Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
