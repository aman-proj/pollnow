

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/my-polls", label: "My Polls" },
  { href: "/voted", label: "Voted" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-white/[0.04] backdrop-blur-xl">
      <div className="max-w-6xl mx-auto h-full px-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5abbf4] to-[#00cec9] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Poll<span className="text-[#00cec9]">Now</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {session &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-white/[0.08] text-white shadow-sm"
                    : "text-[#6b6b80] hover:text-white/80 hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            ))}

          <div className="w-px h-5 bg-white/[0.06] mx-2" />

          {!session ? (
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white hover:shadow-lg hover:shadow-[#6c5ce7]/20 hover:scale-105 transition-all duration-300"
            >
              Login with Google
            </button>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200 group"
              >
                {session.user.image ? (
                  <div className="relative w-8 h-8 rounded-full ring-2 ring-white/10 group-hover:ring-[#00cec9]/30 transition-all duration-300">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white/10 group-hover:ring-[#00cec9]/30 transition-all duration-300">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-white max-w-[120px] truncate">
                  {session.user.name?.split(" ")[0] || "User"}
                </span>
                <svg
                  className={`w-4 h-4 text-[#6b6b80] transition-transform duration-200 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-card border border-white/[0.08] rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-white/[0.06]">
                    <p className="text-sm font-medium text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-[#6b6b80] truncate mt-0.5">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-[#6b6b80] hover:text-white hover:bg-white/[0.04] rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#111118] border-t border-white/10 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-5 py-4 space-y-1">
            {session &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "bg-white/[0.08] text-white"
                      : "text-[#6b6b80] hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

            <div className="h-px bg-white/[0.06] my-3" />

            {!session ? (
              <button
                onClick={() => signIn("google")}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white"
              >
                Login with Google
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3.5 py-2">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-sm font-semibold">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-[#6b6b80] truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-sm text-[#6b6b80] hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}