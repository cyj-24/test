"use client";

import { useFormStatus } from "react-dom";
import { joinHousehold } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "加入中..." : "加入家庭"}
    </button>
  );
}

export function JoinHouseholdForm() {
  return (
    <form action={joinHousehold} className="space-y-4">
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
          required
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
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
