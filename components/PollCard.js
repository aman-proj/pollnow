"use client";

import ProgressBar from "./ProgressBar";

export default function PollCard({ poll, hasVoted, selectedId }) {
  const maxVotes = Math.max(...poll.options.map((o) => o.votes));

  return (
    <div className="space-y-4">
      {hasVoted && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50/80 border border-purple-200/40">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="text-xs font-medium text-purple-600">You already voted</span>
        </div>
      )}

      <div className="space-y-3">
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

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {poll.totalVotes} total {poll.totalVotes === 1 ? "vote" : "votes"}
        </span>
        {selectedId && (
          <span className="text-xs text-purple-400">
            You voted for: {poll.options.find((o) => o.id === selectedId)?.text}
          </span>
        )}
      </div>
    </div>
  );
}
