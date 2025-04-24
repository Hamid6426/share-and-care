// components/ReceiverSidebar.jsx
"use client";

import Link from "next/link";
import React from "react";
import { MdHome, MdDashboard, MdSettings, MdLogout, MdPerson, MdChat, MdListAlt, MdRequestPage } from "react-icons/md";
import Tooltip from "@/components/Tooltips";
import { toast } from "react-toastify";

const logoutHandler = () => {
  const token: any = localStorage.getItem("token");
  if (token) {
    console.log("Token is available")
  }
  try {
    const removeToken: any = localStorage.getItem("token");
    return removeToken;
    toast.success("Token Removed")
  } catch {
    toast.error("Token removal failed")
  }
}

export default function DonorSidebar() {
  return (
    <div className="sticky shadow-md text-2xl text-green-500 top-0 z-50 flex flex-col justify-between items-center py-2 h-screen bg-green-100 w-12">
      <div>
        <Tooltip message="Home">
          <Link href="/">
            <MdHome className="hover:text-green-600" />
          </Link>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-6 justify-center items-center">
        <Tooltip message="Overview">
          <Link href="/donor">
            <MdDashboard className="hover:text-green-600" />
          </Link>
        </Tooltip>
        <Tooltip message="My Listing">
          <Link href="/donor/my-listing">
            <MdListAlt className="hover:text-green-600" />
          </Link>
        </Tooltip>
        <Tooltip message="Requested Items">
          <Link href="/donor/requested-items">
            <MdRequestPage className="hover:text-green-600" />
          </Link>
        </Tooltip>
        <Tooltip message="Chats">
          <Link href="/donor/chats">
            <MdChat className="hover:text-green-600" />
          </Link>
        </Tooltip>
        <Tooltip message="Profile">
          <Link href="/donor/profile">
            <MdPerson className="hover:text-green-600" />
          </Link>
        </Tooltip>
        <Tooltip message="Settings">
          <Link href="/donor/settings">
            <MdSettings className="hover:text-green-600" />
          </Link>
        </Tooltip>
      </div>
      <Tooltip message="Logout">
        <button onClick={logoutHandler}>
          <MdLogout className="hover:text-green-600" />
        </button>
      </Tooltip>
    </div>
  );
}
