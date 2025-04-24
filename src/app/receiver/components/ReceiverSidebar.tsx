// components/ReceiverSidebar.jsx
"use client";

import Link from "next/link";
import React from "react";
import { MdHome, MdDashboard, MdRequestPage, MdSettings, MdLogout, MdPerson, MdChat } from "react-icons/md";
import Tooltip from "@/components/Tooltips";

export default function ReceiverSidebar() {
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
          <Link href="/receiver">
            <MdDashboard className="hover:text-green-600" />
          </Link>
        </Tooltip>
        <Tooltip message="My Requests">
          <Link href="/receiver/my-requests">
            <MdRequestPage className="hover:text-green-600" />
          </Link>
        </Tooltip>
        <Tooltip message="Chats">
          <Link href="/receiver/chats">
            <MdChat className="hover:text-green-600" />
          </Link>
        </Tooltip>
        <Tooltip message="Profile">
          <Link href="/receiver/profile">
            <MdPerson className="hover:text-green-600" />
          </Link>
        </Tooltip>
        <Tooltip message="Settings">
          <Link href="/receiver/settings">
            <MdSettings className="hover:text-green-600" />
          </Link>
        </Tooltip>
      </div>
      <Tooltip message="Logout">
        <button>
          <MdLogout className="hover:text-green-600" />
        </button>
      </Tooltip>
    </div>
  );
}
