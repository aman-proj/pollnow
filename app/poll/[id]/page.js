"use client";

import { useState, useEffect, use } from "react";
import { toast } from "sonner";
import VoteOptions from "@/components/VoteOptions";
import PollCard from "@/components/PollCard";
import { getPoll } from "@/lib/mockData";
import Link from "next/link";

export default function PollPage({ params }) {
  const { id } = use(params);
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate fetch
    const timer = setTimeout(() => {
      const data = getPoll(id);
      setPoll(data ? { ...data, options: data.options.map((o) => ({ ...o })) } : null);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const handleVote = async () => {
    if (!selectedId) {
      toast.error("Please select an option");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));

    setPoll((prev) => {
      const updated = { ...prev, totalVotes: prev.totalVotes + 1 };
      updated.options = prev.options.map((o) =>
        o.id === selectedId ? { ...o, votes: o.votes + 1 } : { ...o }
      );
      return updated;
    });

    setHasVoted(true);
    setIsSubmitting(false);
    toast.success("Vote submitted!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-purple-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm text-gray-400">Loading poll...</span>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-6">
        <div className="glass-card rounded-3xl p-10 shadow-xl shadow-purple-100/20 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-700 mb-1">Poll Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">This poll doesn&apos;t exist or may have been removed.</p>
          <Link
            href="/create"
            className="inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-purple-200/50 hover:scale-105 transition-all duration-300"
          >
            Create a New Poll
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50/80 border border-purple-100/50 text-[11px] font-medium text-purple-500 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Live Poll
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{poll.question}</h1>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-100/20">
          {!hasVoted ? (
            <div className="space-y-5">
              <VoteOptions
                options={poll.options}
                selectedId={selectedId}
                onSelect={setSelectedId}
                disabled={isSubmitting}
                hasVoted={false}
              />

              <button
                onClick={handleVote}
                disabled={!selectedId || isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {isSubmitting ? "Submitting..." : "Submit Vote"}
              </button>
            </div>
          ) : (
            <PollCard poll={poll} hasVoted={hasVoted} selectedId={selectedId} />
          )}
        </div>
      </div>
    </div>
  );
}
