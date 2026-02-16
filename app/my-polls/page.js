


"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import ProgressBar from "@/components/ProgressBar";
import { supabase } from "@/lib/supabase";
export default function MyPollsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      fetchMyPolls();
    }
  }, [status, router]);

  useEffect(() => {
  if (!polls.length) return;

  const pollIds = polls.map(p => p.id);

  const channel = supabase
    .channel("my-polls-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "votes",
      },
      (payload) => {
        const { poll_id, option_id } = payload.new;

        // Ignore votes not related to your polls
        if (!pollIds.includes(poll_id)) return;

        console.log("Realtime vote:", payload);

        setPolls(prevPolls =>
          prevPolls.map(poll => {
            if (poll.id !== poll_id) return poll;

            return {
              ...poll,
              totalVotes: poll.totalVotes + 1,
              options: poll.options.map(option =>
                option.id === option_id
                  ? { ...option, votes: option.votes + 1 }
                  : option
              ),
            };
          })
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [polls.length]);

  const fetchMyPolls = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/polls/my-polls");

      if (!res.ok) {
        throw new Error("Failed to fetch polls");
      }

      const data = await res.json();
      setPolls(data);
    } catch (error) {
      console.error("Error fetching polls:", error);
      toast.error("Failed to load your polls");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-[#6c5ce7]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm text-[#6b6b80]">Loading your polls...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">My Polls</h1>
          <p className="text-sm text-[#6b6b80]">
            Polls you created with live voting stats
          </p>
        </div>
        <Link
          href="/create"
          className="hidden sm:inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#6c5ce7]/20 hover:scale-105 transition-all duration-300"
        >
          + New Poll
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center glow-sm">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b6b80"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M7 16h2" />
              <path d="M11 12h2" />
              <path d="M15 8h2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">No polls yet</h2>
          <p className="text-sm text-[#6b6b80] mb-6">
            Create your first poll and start collecting votes.
          </p>
          <Link
            href="/create"
            className="inline-flex px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white font-semibold text-sm hover:scale-105 transition-all duration-300"
          >
            Create Poll
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => {
            const isExpanded = expandedId === poll.id;
            const maxVotes = Math.max(...poll.options.map((o) => o.votes));
            return (
              <div
                key={poll.id}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.1]"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : poll.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {poll.question}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-[#6b6b80]">
                        {poll.totalVotes} votes
                      </span>
                      <span className="text-xs text-[#6b6b80]">
                        {poll.options.length} options
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-[#00cec9]">
                        <span className="w-1 h-1 rounded-full bg-[#00cec9] animate-pulse" />
                        Live
                      </span>
                    </div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6b6b80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-5 pt-0 space-y-3 border-t border-white/[0.04]">
                    <div className="pt-4 space-y-3">
                      {poll.options.map((option) => (
                        <ProgressBar
                          key={option.id}
                          label={option.text}
                          percentage={
                            poll.totalVotes > 0
                              ? (option.votes / poll.totalVotes) * 100
                              : 0
                          }
                          votes={option.votes}
                          isWinner={option.votes === maxVotes && option.votes > 0}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-[#3d3d50]">
                        Created {new Date(poll.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/poll/${poll.id}`}
                        className="text-xs font-medium text-[#6c5ce7] hover:text-[#a29bfe] transition-colors"
                      >
                        Open poll →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile FAB */}
      <Link
        href="/create"
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white shadow-xl shadow-[#6c5ce7]/30 flex items-center justify-center hover:scale-110 transition-all duration-300 z-50"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>
    </div>
  );
}


