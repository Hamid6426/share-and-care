"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

interface LocationInfo {
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  zipCode?: string;
  address?: string;
}

const PatchLocationInfo: React.FC = () => {
  const { currentUser, loadUserProfile } = useAuth();
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    country: "Not Added",
    state: "Not Added",
    city: "Not Added",
    street: "Not Added",
    zipCode: "Not Added",
    address: "Not Added",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLocationInfo({
        country: currentUser.country || "Not Added",
        state: currentUser.state || "Not Added",
        city: currentUser.city || "Not Added",
        street: currentUser.street || "Not Added",
        zipCode: currentUser.zipCode || "Not Added",
        address: currentUser.address || "Not Added",
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocationInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axiosInstance.patch("/api/profile/update", locationInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // refresh context user data if needed:
      await loadUserProfile();
      toast.success("Location information updated successfully");
    } catch (error: any) {
      console.error("Error updating location info:", error);
      toast.error(error.response?.data?.error || "Failed to update location information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full   rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-primary mb-4">Location Info</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(locationInfo).map(([key, value]) => (
            <div key={key}>
              <label htmlFor={key} className="block text-primary text-sm mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                id={key}
                name={key}
                type="text"
                value={value || ""}
                onChange={handleChange}
                className="w-full border border-primary rounded-md px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-accent text-white font-medium py-2 rounded-md transition disabled:opacity-50">
            {isSubmitting ? "Updating…" : "Update Location Info"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatchLocationInfo;
