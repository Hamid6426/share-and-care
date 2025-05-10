"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
  const pathname = usePathname();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currentUser, isUserLoading } = useAuth();

  const excludedBasePaths = ["/donor", "/receiver", "/admin", "/chats"];
  const shouldHideFooter = excludedBasePaths.some((basePath) => pathname.startsWith(basePath));
  if (shouldHideFooter) return null;

  return (
    <footer className="bg-card text-text-primary shadow-soft">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6">
          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
            <Link href="/about" className="hover:text-accent"> 
              About
            </Link>
            <Link href="/contact" className="hover:text-accent">
              Contact
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/listing" className="hover:text-accent">
              Listing
            </Link>
            <Link href="/demo" className="hover:text-accent">
              Demo
            </Link>
            <Link href={`/${currentUser?._id}`} className="hover:text-accent">
              Profile
            </Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <Link href="/privacy-policy" className="hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="hover:text-accent">
              Cookie Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-accent">
              Terms of Service
            </Link>
          </div>

          {/* Brand or Call to Action */}
          <div className="">
            <h3 className="font-bold mb-2 text-3xl text-primary">SHARE n CARE</h3>
            <p className="text-lg">Bridging communities with compassion and care to help those who are in need of help and spread happiness</p>
          </div>
        </div>

        <div className="mt-8 pt-4 text-center text-text-primary">&copy; {new Date().getFullYear()} SHARE n CARE. All rights reserved.</div>
      </div>
    </footer>
  );
}
