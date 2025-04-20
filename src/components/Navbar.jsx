// components/Navbar.jsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  const pathname = usePathname();

  const excludedBasePaths = ["/donor", "/receiver", "/admin"];

  const shouldHideNavbar = excludedBasePaths.some((basePath) => pathname.startsWith(basePath));

  if (shouldHideNavbar) return null;

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <nav className="h-14 px-2 md:px-4 bg-green-100 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-green-500">
          SHARE & CARE
        </Link>

        <div className="flex gap-6 items-center text-green-500 text-sm font-bold">
          <Link href="/about" className="hover:text-green-600">
            ABOUT
          </Link>
          <Link href="/contact" className="hover:text-green-600">
            CONTACT
          </Link>
          <Link href="/demo" className="hover:text-green-600">
            DEMO
          </Link>
        </div>

        <div className="flex gap-6 items-center text-green-500 text-sm font-bold">
          <Link href="/signin" className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md">
            SIGN IN
          </Link>
        </div>
      </nav>
    </header>
  );
}
