"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ShareLinkBox({ link }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-green-200/50 bg-green-50/40">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-green-700">Poll Created Successfully!</span>
      </div>
      <p className="text-xs text-gray-500 mb-2">Share this link with others:</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white/70 rounded-xl px-4 py-2.5 text-sm text-gray-600 font-mono truncate border border-gray-100">
          {link}
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            copied
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-200/50 hover:scale-105"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
