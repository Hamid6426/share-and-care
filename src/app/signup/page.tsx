"use client";

import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import Link from "next/link";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/register", formData);
      toast.success(res.data.message || "Registered successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to register.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh_-_4rem)] px-4">
      <div className="w-full max-w-md bg-card shadow-soft rounded-md p-8">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-primary text-sm mb-1">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
              className="w-full border border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-text-primary text-sm mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full border border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-text-primary text-sm mb-1">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="w-full border border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-accent text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="flex justify-center mt-3">
          Already have an account?&nbsp;
          <Link
            href="/signin"
            className="text-primary font-bold hover:text-accent transition duration-200"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
