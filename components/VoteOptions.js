"use client";

export default function VoteOptions({ options, selectedId, onSelect, disabled, hasVoted }) {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        return (
          <button
            key={option.id}
            onClick={() => !disabled && onSelect(option.id)}
            disabled={disabled}
            className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 ${
              disabled
                ? "cursor-default"
                : "cursor-pointer hover:scale-[1.02] hover:shadow-md active:scale-[0.99]"
            } ${
              isSelected && !hasVoted
                ? "border-purple-400 bg-purple-50/80 shadow-md shadow-purple-100/50 ring-2 ring-purple-300/30"
                : isSelected && hasVoted
                ? "border-purple-300 bg-purple-50/60"
                : "border-gray-200/60 bg-white/50 hover:bg-white/70 hover:border-gray-300/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                  isSelected
                    ? "border-purple-500 bg-purple-500"
                    : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium ${isSelected ? "text-purple-700" : "text-gray-600"}`}>
                {option.text}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
