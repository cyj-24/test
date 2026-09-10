"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface InviteCodeSuccessProps {
  inviteCode: string;
}

export function InviteCodeSuccess({ inviteCode }: InviteCodeSuccessProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleEnter = () => {
    router.push("/");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">家庭创建成功！</h2>
          <p className="mt-2 text-sm text-gray-500">
            分享以下邀请码给家庭成员，他们可以使用此邀请码加入
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-100 rounded-lg px-6 py-4 font-mono text-2xl tracking-widest text-center">
            {inviteCode}
          </div>

          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? "✓ 已复制" : "复制邀请码"}
          </button>
        </div>

        <button
          onClick={handleEnter}
          className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          进入首页
        </button>
      </div>
    </div>
  );
}
