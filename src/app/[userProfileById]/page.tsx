"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

// Function to format the date to MM-DD-YYYY
const formatDate = (date: string | null) => {
  if (!date) return "Not Available";
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}-${dd}-${d.getFullYear()}`;
};

const PublicProfile = () => {
  const { receiverId } = useParams() as { receiverId: string };

  const { currentUser, isUserLoading } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false); // State to manage the chat modal

  if (isUserLoading) {
    return <p>Loading...</p>;
  }

  if (!currentUser) {
    return <p>User not found or not logged in.</p>;
  }

  const formField = (label: string, value: string | null, type = "text") => (
    <div>
      <label className="block text-green-800 text-sm mb-1">{label}:</label>
      <input
        type={type}
        value={value ?? "Not Added"}
        readOnly
        className="w-full border border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500 rounded-md px-3 py-2 mb-4 bg-gray-100"
      />
    </div>
  );

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold my-6 text-green-800 ">User Profile</h1>

      {/* Profile Picture */}
      <div>
        <div className="mb-4">
          {currentUser.profilePicture ? (
            <Image width={40} height={40} src={currentUser.profilePicture} alt="Profile Picture" className="w-32 h-32 object-cover rounded-full" />
          ) : (
            <>
              <label className="block text-green-800 text-sm mb-1">Profile Picture:</label>
              <p className="text-red-500">No profile picture available</p>
            </>
          )}
        </div>
      </div>

      {formField("Name", currentUser.name)}
      {formField("Email", currentUser.email, "email")}
      {formField("Role", currentUser.role.toUpperCase())}
      {formField("Phone", currentUser.phone)}
      {formField("Country", currentUser.country)}
      {formField("State", currentUser.state)}
      {formField("City", currentUser.city)}

      {/* Format and display the Verified At date */}
      {formField('Joined "Share n Care" since', formatDate(currentUser.createdAt))}
    </div>
  );
};

export default PublicProfile;
