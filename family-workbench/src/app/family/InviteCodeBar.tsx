"use client";

import { useState, useTransition } from "react";
import { regenerateInviteCode } from "@/app/actions";

interface InviteCodeBarProps {
  isParent: boolean;
  inviteCode: string | null;
}

export function InviteCodeBar({ isParent, inviteCode }: InviteCodeBarProps) {
  const [code, setCode] = useState(inviteCode);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleRegenerate = () => {
    startTransition(async () => {
      const result = await regenerateInviteCode();
      if (result.success) {
        setCode(result.data.inviteCode);
        setShowConfirm(false);
      }
    });
  };

  if (!isParent) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
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
            <p className="text-sm font-medium text-gray-900">已加入家庭</p>
            <p className="text-xs text-gray-500">联系家长获取邀请码以邀请其他成员</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
      <div>
        <h2 className="text-sm font-medium text-gray-700 mb-2">邀请码</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-xl tracking-widest text-center">
            {code}
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? "已复制" : "复制"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          分享此邀请码给家庭成员，他们可以使用此邀请码加入家庭
        </p>
      </div>

      {showConfirm ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 mb-3">
            确定要重新生成邀请码吗？旧邀请码将立即失效。
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isPending}
              className="flex-1 px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
            >
              {isPending ? "生成中..." : "确定"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          重新生成邀请码
        </button>
      )}
    </section>
  );
}
