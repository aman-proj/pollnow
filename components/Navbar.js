"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/my-polls", label: "My Polls" },
  { href: "/voted", label: "Voted" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto h-full px-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 16h2" />
              <path d="M11 12h2" />
              <path d="M15 8h2" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Poll<span className="text-[#00cec9]">Now</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "bg-white/[0.08] text-white"
                  : "text-[#6b6b80] hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-white/[0.06] mx-2" />
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white hover:shadow-lg hover:shadow-[#6c5ce7]/20 hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[#6b6b80] hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-card border-t border-white/[0.04] px-5 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-white/[0.08] text-white"
                  : "text-[#6b6b80] hover:text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-[#6c5ce7]"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
