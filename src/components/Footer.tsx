"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currentUser, isUserLoading } = useAuth();

  const excludedBasePaths = ["/donor", "/receiver", "/admin", "/chats"];
  const shouldHideFooter = excludedBasePaths.some((basePath) =>
    pathname.startsWith(basePath)
  );
  if (shouldHideFooter) return null;

  return (
    <footer className="bg-card text-text-primary shadow-soft">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex gap-x-12 gap-y-4 max-w-[540px] mx-auto flex-wrap items-center justify-center text-lg">
          {/* Navigation */}
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <Link href="/about" className="hover:text-accent">
            About
          </Link>
          <Link href="/contact" className="hover:text-accent">
            Contact
          </Link>

          <Link href="/listing" className="hover:text-accent">
            Listing
          </Link>
          <Link href="/demo" className="hover:text-accent">
            Demo
          </Link>
          <Link href={`/${currentUser?._id}`} className="hover:text-accent">
            Profile
          </Link>

          <Link href="/privacy-policy" className="hover:text-accent">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="hover:text-accent">
            Terms of Service
          </Link>
        </div>

        <div className="flex items-center justify-center flex-col mt-8">
          <h3 className="font-bold mb-4 text-5xl text-primary">SHARE n CARE</h3>
          <p className="text-xl text-center max-w-[640px]">
            Bridging communities with compassion and care to help those who are
            in need of help and spread happiness
          </p>
        </div>

        <div className="mt-8 text-lg font-bold text-center text-text-primary">
          &copy; {new Date().getFullYear()} SHARE n CARE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
