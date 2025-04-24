"use client";

import ReceiverSidebar from "./components/ReceiverSidebar";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ReceiverDashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isUserLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (!currentUser) {
        router.push("/unauthorized");
        return;
      }

      if (currentUser.role !== "receiver") {
        router.push(`/${currentUser.role}`);
      }
    }
  }, [isUserLoading, currentUser, router]);

  if (isUserLoading || !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-green-700 font-semibold">Loading...</p>
      </div>
    );
  }

  if (currentUser.role !== "receiver") {
    return null; // Optional fallback UI while redirecting
  }

  return (
    <div className="flex">
      <ReceiverSidebar />
      <main className="flex-1 px-4 py-2">{children}</main>
    </div>
  );
}
