"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OptionInput from "@/components/OptionInput";
import ShareLinkBox from "@/components/ShareLinkBox";


export default function CreatePollPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdLink, setCreatedLink] = useState(null);

  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length >= 6) {
      toast.error("Maximum 6 options allowed");
      return;
    }
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!question.trim()) {
    toast.error("Please enter a poll question");
    return;
  }

  const filledOptions = options.filter((o) => o.trim());
  if (filledOptions.length < 2) {
    toast.error("Please provide at least 2 options");
    return;
  }

  try {
    setIsSubmitting(true);

    const res = await fetch("/api/polls/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question.trim(),
        options: filledOptions,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to create poll");
    }

    // You get pollId from backend
    const link = `${window.location.origin}/poll/${data.pollId}`;

    setCreatedLink(link);

    toast.success("Poll created successfully!");

    // OPTIONAL (Better UX)
    // router.push(`/poll/${data.pollId}`);
    
  } catch (err) {
    toast.error(err.message);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex items-start justify-center min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Create a Poll</h1>
          <p className="text-sm text-gray-400">Ask a question and let people vote in real-time.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-100/20 space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Your Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you want to ask?"
                className="w-full px-4 py-3.5 rounded-xl bg-white/60 border border-gray-200/60 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-300 transition-all duration-200"
                disabled={!!createdLink}
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Options</label>
              <div className="space-y-2.5">
                {options.map((opt, i) => (
                  <OptionInput
                    key={i}
                    index={i}
                    value={opt}
                    onChange={(val) => updateOption(i, val)}
                    onRemove={() => removeOption(i)}
                    canRemove={options.length > 2 && !createdLink}
                  />
                ))}
              </div>

              {!createdLink && options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-1.5 mt-2 px-3 py-2 rounded-xl text-xs font-medium text-purple-500 hover:bg-purple-50/60 transition-all duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Option
                </button>
              )}
            </div>

            {/* Submit */}
            {!createdLink && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {isSubmitting ? "Creating..." : "Create Poll"}
              </button>
            )}
          </div>
        </form>

        {/* Share Link */}
        {createdLink && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ShareLinkBox link={createdLink} />
          </div>
        )}
      </div>
    </div>
  );
}