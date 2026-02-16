"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProgressBar from "@/components/ProgressBar";

export default function VotedPollsPage() {
  const { data: session, status } = useSession();
  const [polls, setPolls] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchVoted = async () => {
      const res = await fetch("/api/polls/voted");
      const data = await res.json();
      setPolls(data);
      setLoading(false);
    };

    fetchVoted();
  }, [status]);

  // 🔥 Realtime subscription
  useEffect(() => {
    if (!polls.length) return;

    const pollIds = polls.map(p => p.id);

    const channel = supabase
      .channel("voted-polls-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
        },
        (payload) => {
          const { poll_id, option_id } = payload.new;

          if (!pollIds.includes(poll_id)) return;

          setPolls(prev =>
            prev.map(poll => {
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

    return () => supabase.removeChannel(channel);
  }, [polls.length]);

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Voted Polls</h1>
        <p className="text-sm text-[#6b6b80]">Polls you voted in &mdash; track live results</p>
      </div>

      {polls.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center glow-sm">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b6b80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">No votes yet</h2>
          <p className="text-sm text-[#6b6b80] mb-6">Vote on a poll to see it tracked here.</p>
          <Link
            href="/leaderboard"
            className="inline-flex px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white font-semibold text-sm hover:scale-105 transition-all duration-300"
          >
            Browse Polls
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
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-white truncate">{poll.question}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#6b6b80]">{poll.totalVotes} votes</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6c5ce7]/10 text-[10px] font-medium text-[#a29bfe]">
                        Voted
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
                    className={`shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
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
                          percentage={poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0}
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
                        View poll
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
