// src/app/donor-dashboard/layout.tsx
"use client";

import DonorSidebar from "./components/DonorSidebar";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import DonorNavbar from "@/components/DashboardNavbar";

export default function DonorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isUserLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (!currentUser) {
        router.push("/unauthorized");
        return;
      }

      if (currentUser.role !== "donor") {
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

  if (currentUser.role !== "donor") {
    return null; // Optional fallback UI while redirecting
  }

  return (
    <div className="flex">
      <DonorSidebar />

      <main className="flex-1">
        <DonorNavbar />
        <div className="p-3 bg-background">{children}</div>
      </main>
    </div>
  );
}
