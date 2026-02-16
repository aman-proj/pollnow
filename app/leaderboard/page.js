"use client";

import Link from "next/link";
import { getLeaderboard } from "@/lib/mockData";

export default function LeaderboardPage() {
  const polls = getLeaderboard();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Leaderboard</h1>
        <p className="text-sm text-[#6b6b80]">Top 10 most voted polls right now</p>
      </div>

      <div className="space-y-3">
        {polls.map((poll, index) => {
          const isTop3 = index < 3;
          const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
          const maxVotes = Math.max(...poll.options.map((o) => o.votes));
          const winner = poll.options.find((o) => o.votes === maxVotes);

          return (
            <Link
              key={poll.id}
              href={`/poll/${poll.id}`}
              className="group glass-card rounded-2xl px-5 py-4 flex items-center gap-4 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.03]"
            >
              {/* Rank */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                  isTop3
                    ? "bg-white/[0.06]"
                    : "bg-white/[0.03] text-[#6b6b80]"
                }`}
                style={isTop3 ? { color: rankColors[index] } : undefined}
              >
                {index + 1}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#a29bfe] transition-colors">
                  {poll.question}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[#6b6b80]">
                    {poll.totalVotes.toLocaleString()} votes
                  </span>
                  {winner && (
                    <span className="text-xs text-[#00cec9] truncate max-w-[140px]">
                      Leading: {winner.text}
                    </span>
                  )}
                </div>
              </div>

              {/* Vote bar mini */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <div className="w-24 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#00cec9]"
                    style={{ width: `${(poll.totalVotes / polls[0].totalVotes) * 100}%` }}
                  />
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3d3d50"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-[#6b6b80] transition-colors"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
