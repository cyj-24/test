"use client";

import { useState, useTransition } from "react";
import { joinHousehold } from "@/app/actions";

export function JoinHouseholdForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await joinHousehold(formData);
      if (!result.success) {
        setError(result.error);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="inviteCode"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          邀请码
        </label>
        <input
          type="text"
          id="inviteCode"
          name="inviteCode"
          placeholder="输入6位邀请码"
          maxLength={6}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center tracking-widest uppercase"
        />
      </div>

      <div>
        <label
          htmlFor="joinMemberName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          您的名字
        </label>
        <input
          type="text"
          id="joinMemberName"
          name="memberName"
          placeholder="例如：小明"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "加入中..." : "加入家庭"}
      </button>
    </form>
  );
}
