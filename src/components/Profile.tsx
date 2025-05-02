"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaDiscord, FaTelegram, FaWhatsapp, FaTiktok } from "react-icons/fa";

// format date to MM-DD-YYYY
const formatDate = (date: string | null) =>
  date
    ? new Date(date)
        .toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
    : "Not Available";

const Profile = () => {
  const { currentUser, isUserLoading } = useAuth();

  if (isUserLoading) return <p className="text-center py-10">Loading profile…</p>;
  if (!currentUser) return <p className="text-center py-10 text-red-500">User not logged in.</p>;

  // reusable info row
  const InfoItem = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="mb-4">
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="text-sm text-gray-800">{value ?? "Not Added"}</p>
    </div>
  );

  // social button
  const SocialBtn = ({ icon: Icon, url }: { icon: React.ElementType; url?: string | null }) =>
    url ? (
      <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-full">
        <Icon size={24} />
      </a>
    ) : null;

  return (
    <div className="mx-auto max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 text-white flex flex-col md:flex-row space-x-4">
        {currentUser.profilePicture ? (
          <Image
            src={currentUser.profilePicture}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold">{currentUser.name}</h2>
          <span className="inline-block mt-1 bg-white/30 text-xs uppercase px-2 py-1 rounded-full">
            {currentUser.role}
          </span>
          <p className="mt-2 text-xs">Joined {formatDate(currentUser.createdAt)}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <InfoItem label="Email" value={currentUser.email} />
        <InfoItem label="Phone" value={currentUser.phone} />
        <InfoItem label="Country" value={currentUser.country} />
        <InfoItem label="State" value={currentUser.state} />
        <InfoItem label="City" value={currentUser.city} />
        <InfoItem label="Street" value={currentUser.street} />
        <InfoItem label="Zip Code" value={currentUser.zipCode} />
        <InfoItem label="Address" value={currentUser.address} />
        <InfoItem label="Bio" value={currentUser.bio} />
        <InfoItem label="Verified" value={currentUser.isVerified ? "Yes" : "No"} />
      </div>

      {/* Footer: Social */}
      <div className="gap-x-6 pl-6 md:pl-0 pb-6 flex text-gray-600 flex-wrap">
        <SocialBtn icon={FaTwitter} url={currentUser.twitter} />
        <SocialBtn icon={FaLinkedin} url={currentUser.linkedin} />
        <SocialBtn icon={FaFacebook} url={currentUser.facebook} />
        <SocialBtn icon={FaInstagram} url={currentUser.instagram} />
        <SocialBtn icon={FaDiscord} url={currentUser.discord} />
        <SocialBtn icon={FaTelegram} url={currentUser.telegram} />
        <SocialBtn icon={FaWhatsapp} url={currentUser.whatsapp} />
        <SocialBtn icon={FaTiktok} url={currentUser.tiktok} />
      </div>
    </div>
  );
};

export default Profile;
