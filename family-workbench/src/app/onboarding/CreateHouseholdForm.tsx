"use client";

import { useFormStatus } from "react-dom";
import { createHousehold } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "创建中..." : "创建家庭"}
    </button>
  );
}

export function CreateHouseholdForm() {
  return (
    <form action={createHousehold} className="space-y-4">
      <div>
        <label
          htmlFor="householdName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          家庭名称
        </label>
        <input
          type="text"
          id="householdName"
          name="householdName"
          placeholder="例如：王家"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label
          htmlFor="memberName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          您的名字
        </label>
        <input
          type="text"
          id="memberName"
          name="memberName"
          placeholder="例如：王妈妈"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
