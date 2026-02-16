

"use client";

import { useState, useEffect, use } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import VoteOptions from "@/components/VoteOptions";
import PollCard from "@/components/PollCard";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
export default function PollPage({ params }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
const [checkingVote, setCheckingVote] = useState(true);



useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setCheckingVote(true);

      // Fetch poll
      const pollRes = await fetch(`/api/polls/${id}`);
      if (!pollRes.ok) {
        setPoll(null);
        return;
      }

      const pollData = await pollRes.json();
      setPoll(pollData);

      // Only check vote if user authenticated
      if (status === "authenticated") {
        const voteCheckRes = await fetch(`/api/polls/${id}/check-vote`);
        const voteData = await voteCheckRes.json();

        setHasVoted(voteData.hasVoted);
setSelectedId(voteData.selectedId);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setCheckingVote(false);
    }
  };

  if (id && status !== "loading") {
    fetchData();
  }

}, [id, status]);

useEffect(() => {
  if (!id) return;

  const channel = supabase
    .channel(`poll-${id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "votes",
        filter: `poll_id=eq.${id}`, // 🔥 important
      },
      (payload) => {
        console.log("Realtime vote:", payload);

        setPoll(prev => {
          if (!prev) return prev;

          return {
            ...prev,
            options: prev.options.map(opt =>
              opt.id === payload.new.option_id
                ? { ...opt, votes: opt.votes + 1 }
                : opt
            ),
            totalVotes: prev.totalVotes + 1,
          };
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [id]);

  const handleVote = async () => {
    if (!selectedId) {
      toast.error("Please select an option");
      return;
    }

    if (!session) {
      toast.error("Please login to vote");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/polls/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selectedId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to submit vote");
        setIsSubmitting(false);
        return;
      }

      // Immediately fetch updated results
      const pollRes = await fetch(`/api/polls/${id}`);
      const updatedPoll = await pollRes.json();
      setPoll(updatedPoll);

      setHasVoted(true);
      toast.success("Vote submitted successfully!");
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyShareLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poll.question,
          text: `Vote on: ${poll.question}`,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyShareLink();
        }
      }
    } else {
      copyShareLink();
    }
  };

if (loading || checkingVote || status === "loading") {
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
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50/80 border border-purple-100/50 text-[11px] font-medium text-purple-500">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Live Poll 
            </div>
            
            <button
              onClick={shareViaWebShare}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-[#6b6b80] hover:text-white transition-all flex items-center gap-1.5"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-100">{poll.question}</h1>
          {poll.creatorName && (
            <p className="text-sm text-gray-500 mt-2">
              Created by {poll.creatorName}
            </p>
          )}
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-100/20">
          {checkingVote ? (
  <div className="text-center text-sm text-gray-400">
    Checking vote status...
  </div>):!hasVoted ? (
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
                disabled={!selectedId || isSubmitting || !session}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {!session
                  ? "Login to Vote"
                  : isSubmitting
                  ? "Submitting..."
                  : "Submit Vote"}
              </button>
            </div>
          ) : (
            <PollCard poll={poll} hasVoted={hasVoted} selectedId={selectedId} />
          )}
        </div>
        
        {/* Live indicator */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live results • {poll.totalVotes} total votes
          </p>
        </div>
      </div>
    </div>
  );
}