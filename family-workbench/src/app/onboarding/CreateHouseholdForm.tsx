"use client";

import { useState, useTransition } from "react";
import { createHousehold } from "@/app/actions";

interface CreateHouseholdFormProps {
  onSuccess: (inviteCode: string) => void;
}

export function CreateHouseholdForm({ onSuccess }: CreateHouseholdFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createHousehold(formData);
      if (result.success) {
        onSuccess(result.data.inviteCode);
      } else {
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
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "创建中..." : "创建家庭"}
      </button>
    </form>
  );
}
