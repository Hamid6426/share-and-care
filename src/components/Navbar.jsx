"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MdChat, MdClose, MdMenu } from "react-icons/md";
import Tooltip from "./Tooltips";

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, isUserLoading } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const excludedBasePaths = ["/donor", "/receiver", "/admin", "/chats"];
  const shouldHideNavbar = excludedBasePaths.some((basePath) =>
    pathname.startsWith(basePath)
  );
  if (shouldHideNavbar) return null;

  return (
    <header className="bg-card shadow-soft">
      {/* Desktop Navbar */}
      <nav className="hidden h-14 px-3 lg:px-6 lg:flex justify-between items-center">
        <Link href="/" className="text-primary text-2xl font-bold">
          SHARE n CARE
        </Link>

        <div className="flex gap-6 items-center text-black text-sm font-bold">
          <Link
            href="/"
            className={`${
              pathname === "/" ? "text-accent  " : "hover:text-accent"
            }`}
          >
            HOME
          </Link>
          <Link
            href="/about"
            className={`${
              pathname === "/about"
                ? "text-accent  "
                : "hover:text-accent"
            }`}
          >
            ABOUT
          </Link>
          <Link
            href="/contact"
            className={`${
              pathname === "/contact"
                ? "text-accent  "
                : "hover:text-accent"
            }`}
          >
            CONTACT
          </Link>
          <Link
            href="/listing"
            className={`${
              pathname === "/listing"
                ? "text-accent  "
                : "hover:text-accent"
            }`}
          >
            LISTING
          </Link>
        </div>

        <div className="flex gap-6 items-center text-primary text-sm font-bold">
          {!isUserLoading && currentUser ? (
            <div className="flex items-center gap-4">
              <Link href="/chats">
                <MdChat className="text-primary  text-2xl hover:text-secondary transition-colors duration-300" />
              </Link>
              <Link
                href={`/${currentUser.role}`}
                className="bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
              >
                DASHBOARD
              </Link>
            </div>
          ) : (
            <Link
              href="/signin"
              className="bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
            >
              SIGN IN
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden h-14 w-full px-3 lg:px-6 bg-background flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-primary">
          SHARE n CARE
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="cursor-pointer"
        >
          {isMobileMenuOpen ? (
            <MdClose className="text-3xl mt-1 text-primary" />
          ) : (
            <MdMenu className="text-3xl mt-1 text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Navbar */}
      {isMobileMenuOpen && (
        <nav className=" text-center absolute top-14 z-50 right-4 flex flex-col gap-3 text-sm justify-start items-center w-48 lg:hidden px-3 py-4 bg-background  rounded-lg shadow-[0px_0px_16px_4px_#0005] text-primary font-bold">
          <Link
            href="/about"
            className="w-full bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
          >
            ABOUT
          </Link>
          <Link
            href="/contact"
            className="w-full bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
          >
            CONTACT
          </Link>
          <Link
            href="/listing"
            className="w-full bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
          >
            LISTING
          </Link>
          {!isUserLoading && currentUser ? (
            <div>
              <Link
                href="chats"
                className="w-full bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
              ></Link>

              <Link
                href={`/${currentUser.role}`}
                className="w-full bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
              >
                DASHBOARD
              </Link>
            </div>
          ) : (
            <Link
              href="/signin"
              className="w-full bg-primary text-white hover:bg-accent px-4 py-2 rounded-md transition"
            >
              SIGN IN
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
