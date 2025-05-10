// components/DonorSidebar.tsx

"use client";

import Link from "next/link";
import React from "react";
import {
  MdHome,
  MdDashboard,
  MdSettings,
  MdLogout,
  MdPerson,
  MdListAlt,
  MdRequestPage,
  MdAdd,
} from "react-icons/md";
import Tooltip from "@/components/Tooltips";
import { toast } from "react-toastify";

const logoutHandler = () => {
  const token: any = localStorage.getItem("token");
  if (token) {
    console.log("Token is available");
  }
  try {
    const removeToken: any = localStorage.getItem("token");
    return removeToken;
    toast.success("Token Removed");
  } catch {
    toast.error("Token removal failed");
  }
};

export default function DonorSidebar() {
  return (
    <div className="sticky shrink-0 text-2xl text-primary shadow-soft top-0 z-50 flex flex-col justify-between items-center py-4 h-screen w-16">
      <div>
        <Tooltip message="Home">
          <Link href="/">
            <MdHome className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-6 justify-center items-center">
        <Tooltip message="Overview">
          <Link href="/donor">
            <MdDashboard className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
        <Tooltip message="Add Item">
          <Link href="/donor/add-item">
            <MdAdd className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
        <Tooltip message="My Listing">
          <Link href="/donor/my-listing">
            <MdListAlt className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
        <Tooltip message="Requested Items">
          <Link href="/donor/requested-items">
            <MdRequestPage className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
        {/* <Tooltip message="Chats">
          <Link href="/donor/chats">
            <MdChat className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip> */}
        <Tooltip message="Profile">
          <Link href="/donor/profile">
            <MdPerson className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
        <Tooltip message="Settings">
          <Link href="/donor/settings">
            <MdSettings className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
      </div>
      <Tooltip message="Logout">
        <button onClick={logoutHandler}>
          <MdLogout className="hover:text-secondary transition-colors duration-300" />
        </button>
      </Tooltip>
    </div>
  );
}
