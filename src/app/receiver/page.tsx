"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

// React Icons
import {
  FaClipboardList,
  FaGift,
  FaBoxOpen,
  FaComments,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";

export default function ReceiverDashboardOverview() {
  const { currentUser, isUserLoading } = useAuth();

  if (isUserLoading)
    return <p className="text-center py-10">Loading profile…</p>;

  if (!currentUser)
    return (
      <p className="text-center py-10 text-red-500">User not logged in.</p>
    );

  const menuItems = [
    {
      label: "My Requests",
      href: "/receiver/my-requested-items",
      icon: <FaClipboardList className="text-[4rem]" />,
    },
    {
      label: "Claimed Items",
      href: "/receiver/claimed-items",
      icon: <FaGift className="text-[4rem]" />,
    },
    {
      label: "Received Items",
      href: "/receiver/received-items",
      icon: <FaBoxOpen className="text-[4rem]" />,
    },
      {
        label: "Chats",
        href: "/receiver/chats",
        icon: <FaComments className="text-[4rem]" />,
      },
      {
        label: "Profile",
        href: "/receiver/profile",
        icon: <FaUserCircle className="text-[4rem]" />,
      },
      {
        label: "Settings",
        href: "/receiver/settings",
        icon: <FaCog className="text-[4rem]" />,
      },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-card pb-6">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-white flex flex-col md:flex-row items-center gap-6 shadow-md">
        {currentUser.profilePicture ? (
          <Image
            src={currentUser.profilePicture}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold">
            No Image
          </div>
        )}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight">
            {currentUser.name}
          </h2>
          <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
            {currentUser.role}
          </span>
        </div>
      </div>

      <h2 className="px-6 text-2xl font-bold tracking-tight mt-6 text-primary">
        All Navigations 
      </h2>

      {/* Navigation Buttons */}
      <div className="px-6 grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        {menuItems.map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col justify-center items-center gap-3 bg-primary text-white aspect-square py-5 rounded-lg hover:bg-accent transition-shadow shadow-sm hover:shadow-md text-sm font-medium"
          >
            {icon}
            <p className="text-center text-xs">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
