// src/app/receiver-dashboard/layout.tsx
import ReceiverSidebar from "./components/ReceiverSidebar";
import React from "react";

export default function ReceiverDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <ReceiverSidebar />
      <main className="flex-1 px-4 py-2">{children}</main>
    </div>
  );
}