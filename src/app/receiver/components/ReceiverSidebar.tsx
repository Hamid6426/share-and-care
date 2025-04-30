// components/ReceiverSidebar.tsx

"use client";

import Link from "next/link";
import React from "react";
import { MdHome, MdDashboard, MdRequestPage, MdSettings, MdLogout, MdPerson, MdChat } from "react-icons/md";
import Tooltip from "@/components/Tooltips";

export default function ReceiverSidebar() {
  return (
    <div className="sticky text-2xl text-primary shadow-soft top-0 z-50 flex flex-col justify-between items-center py-4 h-screen w-16">
      <div>
        <Tooltip message="Home">
          <Link href="/">
            <MdHome className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-6 justify-center items-center">
        <Tooltip message="Overview">
          <Link href="/receiver">
            <MdDashboard className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
        <Tooltip message="My Requests">
          <Link href="/receiver/my-requests">
            <MdRequestPage className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
        <Tooltip message="Chats">
          <Link href="/receiver/chats">
            <MdChat className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
        <Tooltip message="Profile">
          <Link href="/receiver/profile">
            <MdPerson className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
        <Tooltip message="Settings">
          <Link href="/receiver/settings">
            <MdSettings className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
      </div>
      <Tooltip message="Logout">
        <button>
          <MdLogout className="hover:text-secondary transition-colors duration-300" />
        </button>
      </Tooltip>
    </div>
  );
}
