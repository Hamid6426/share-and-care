"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

interface SocialInfo {
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  discord?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
}

const PatchSocialInfo: React.FC = () => {
  const { currentUser, loadUserProfile } = useAuth();
  const [socialInfo, setSocialInfo] = useState<SocialInfo>({
    phone: "Not Added",
    whatsapp: "Not Added",
    telegram: "Not Added",
    discord: "Not Added",
    facebook: "Not Added",
    twitter: "Not Added",
    instagram: "Not Added",
    linkedin: "Not Added",
    tiktok: "Not Added",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setSocialInfo({
        phone: currentUser.phone || "Not Added",
        whatsapp: currentUser.whatsapp || "Not Added",
        telegram: currentUser.telegram || "Not Added",
        discord: currentUser.discord || "Not Added",
        facebook: currentUser.facebook || "Not Added",
        twitter: currentUser.twitter || "Not Added",
        instagram: currentUser.instagram || "Not Added",
        linkedin: currentUser.linkedin || "Not Added",
        tiktok: currentUser.tiktok || "Not Added",
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialInfo((prev) => ({ ...prev, [name]: value }));
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
      await axiosInstance.patch("/api/profile/update", socialInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // refresh context user data if needed:
      await loadUserProfile();
      toast.success("Social information updated successfully");
    } catch (error: any) {
      console.error("Error updating social info:", error);
      toast.error(error.response?.data?.error || "Failed to update social information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full   rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-primary mb-4">Social Info</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(socialInfo).map(([key, value]) => (
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
            {isSubmitting ? "Updating…" : "Update Social Info"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatchSocialInfo;
