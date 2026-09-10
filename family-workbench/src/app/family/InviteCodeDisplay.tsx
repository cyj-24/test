"use client";

import { useState } from "react";

interface InviteCodeDisplayProps {
  code: string;
}

export function InviteCodeDisplay({ code }: InviteCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-lg tracking-widest text-center">
        {code}
      </div>
      <button
        onClick={handleCopy}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {copied ? "已复制" : "复制"}
      </button>
    </div>
  );
}
