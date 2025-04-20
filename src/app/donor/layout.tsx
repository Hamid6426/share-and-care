// src/app/receiver-dashboard/layout.tsx
import DonorSidebar from "./components/DonorSidebar";
import React from "react";

export default function DonorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <DonorSidebar />
      <main className="flex-1 px-4 py-2">{children}</main>
    </div>
  );
}