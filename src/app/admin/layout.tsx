// src/app/receiver-dashboard/layout.tsx
import AdminSidebar from "./components/AdminSidebar";
import React from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-2">{children}</main>
    </div>
  );
}