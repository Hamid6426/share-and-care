"use client";

import Link from "next/link";
import React from "react";
import { MdDashboard } from "react-icons/md";
import Tooltip from "@/components/Tooltips";
import {
  FaBoxOpen,
  FaClipboardList,
  FaCog,
  FaComments,
  FaGift,
  FaUserCircle,
} from "react-icons/fa";

export default function ReceiverSidebar() {
  return (
    <div className="sticky shrink-0 text-2xl text-primary shadow-soft top-0 z-50 flex flex-col justify-between items-center py-4 h-screen w-16">
      <div className="flex flex-col gap-6 justify-center items-center">
        <Tooltip message="Overview">
          <Link href="/receiver">
            <MdDashboard className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="My Requests">
          <Link href="/receiver/my-requested-items">
            <FaClipboardList className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="Claimed Items">
          <Link href="/receiver/claimed-items">
            <FaGift className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="Received Items">
          <Link href="/receiver/received-items">
            <FaBoxOpen className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="Chats">
          <Link href="/receiver/chats">
            <FaComments className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="Profile">
          <Link href="/receiver/profile">
            <FaUserCircle className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="Settings">
          <Link href="/receiver/settings">
            <FaCog className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}
