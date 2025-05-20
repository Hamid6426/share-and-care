import Tooltip from "@/components/Tooltips";
import Link from "next/link";
import React from "react";
import { MdHome, MdLogout } from "react-icons/md";
import { toast } from "react-toastify";

export default function DonorNavbar() {
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

  return (
    <div className="sticky top-0 right-0 flex justify-between items-center bg-card px-4 py-2 border-b-2 border-gray-200 text-primary">
      <Link href="/" className="text-primary text-2xl font-bold">
        SHARE n CARE
      </Link>

      <button onClick={logoutHandler} className="bg-primary py-1 px-4 text-white text-base font-semibold cursor-pointer hover:bg-accent">Logout</button>
    </div>
  );
}
