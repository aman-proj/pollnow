"use client";

import { useEffect, useState } from "react";

export default function ProgressBar({ percentage, label, votes, isWinner }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${isWinner ? "text-purple-700" : "text-gray-700"}`}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{votes} votes</span>
          <span className={`font-semibold text-sm ${isWinner ? "text-purple-600" : "text-gray-500"}`}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isWinner
              ? "bg-gradient-to-r from-purple-500 to-pink-500"
              : "bg-gradient-to-r from-purple-300 to-pink-300"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
