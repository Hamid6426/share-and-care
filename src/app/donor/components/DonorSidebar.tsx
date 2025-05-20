"use client";

import Link from "next/link";
import React from "react";
import {
  FaPlusCircle,
  FaClipboardList,
  FaExclamationCircle,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";
import Tooltip from "@/components/Tooltips";
import { MdDashboard } from "react-icons/md";

export default function DonorSidebar() {
  return (
    <div className="sticky shrink-0 text-2xl text-primary border-r-2 border-gray-200 top-0 z-50 flex flex-col items-center py-4 h-screen w-16">
      <div className="flex flex-col gap-6 justify-center items-center">
        <Tooltip message="Overview">
          <Link href="/donor">
            <MdDashboard className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="Add Item">
          <Link href="/donor/add-item">
            <FaPlusCircle className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="My Listings">
          <Link href="/donor/my-listing">
            <FaClipboardList className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="Requested Items">
          <Link href="/donor/requested-items">
            <FaExclamationCircle className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="Profile">
          <Link href="/donor/profile">
            <FaUserCircle className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>

        <Tooltip message="Settings">
          <Link href="/donor/settings">
            <FaCog className="hover:text-secondary transition-colors duration-300" />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}
