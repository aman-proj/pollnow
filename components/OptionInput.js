"use client";

export default function OptionInput({ index, value, onChange, onRemove, canRemove }) {
  return (
    <div className="flex items-center gap-2 group">
      <span className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-xs font-semibold text-purple-500 shrink-0">
        {index + 1}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Option ${index + 1}`}
        className="flex-1 px-4 py-3 rounded-xl bg-white/60 border border-gray-200/60 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-300 transition-all duration-200"
      />
      {canRemove && (
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
