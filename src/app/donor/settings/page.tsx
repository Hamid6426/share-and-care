"use client";
import PatchAccountInfo from "@/components/PatchAccountInfo";
import PatchLocationInfo from "@/components/PatchLocationInfo";
import PatchSocialInfo from "@/components/PatchSocialInfo";
import PatchUserRole from "@/components/PatchUserRole";
import UploadProfilePicture from "@/components/UploadProfilePicture";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

export default function ReceiverSettings() {
  const { currentUser, isUserLoading } = useAuth();
  
    if (isUserLoading) {
      return <p>Loading...</p>;
    }
  
    if (!currentUser) {
      return <p>User not found or not logged in.</p>;
    }
  
    return (
      <div className="max-w-sm mx-auto my-12">
        <h1 className="text-2xl font-bold text-center">Settings</h1>
        <p className="text-gray-500 text-center mb-6 mt-2">Manage your account settings and preferences.</p>
        <div className="space-y-6">
        <UploadProfilePicture />
        <PatchAccountInfo />
        <PatchUserRole />
        <PatchSocialInfo />
        <PatchLocationInfo />
      </div>
      </div>
    );
  }
  