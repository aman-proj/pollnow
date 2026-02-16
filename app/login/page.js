"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!isLogin && !name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success(isLogin ? "Welcome back!" : "Account created!");
    router.push("/my-polls");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm text-[#6b6b80]">
            {isLogin ? "Sign in to manage your polls" : "Start creating polls in seconds"}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 glow-sm">
          {/* Toggle */}
          <div className="flex bg-white/[0.04] rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLogin ? "bg-[#6c5ce7] text-white shadow-sm" : "text-[#6b6b80] hover:text-white/60"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isLogin ? "bg-[#6c5ce7] text-white shadow-sm" : "text-[#6b6b80] hover:text-white/60"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#6b6b80]">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-[#3d3d50] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/40 focus:border-[#6c5ce7]/40 transition-all duration-200"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6b6b80]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-[#3d3d50] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/40 focus:border-[#6c5ce7]/40 transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6b6b80]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-[#3d3d50] focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/40 focus:border-[#6c5ce7]/40 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white font-semibold text-sm shadow-lg shadow-[#6c5ce7]/20 hover:shadow-xl hover:shadow-[#6c5ce7]/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#3d3d50] mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#6c5ce7] hover:text-[#a29bfe] font-medium transition-colors"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
