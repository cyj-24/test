"use client";

import { useState } from "react";
import { CreateHouseholdForm } from "./CreateHouseholdForm";
import { JoinHouseholdForm } from "./JoinHouseholdForm";
import { InviteCodeSuccess } from "./InviteCodeSuccess";

type Step = "select" | "create" | "join" | "success";

export function OnboardingClient() {
  const [step, setStep] = useState<Step>("select");
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const handleCreateSuccess = (code: string) => {
    setInviteCode(code);
    setStep("success");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">家庭管理工作台</h1>
          <p className="mt-2 text-gray-600">
            一起管理家庭待办事项和家务分配
          </p>
        </div>

        {step === "select" && (
          <div className="space-y-4">
            <button
              onClick={() => setStep("create")}
              className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-left hover:border-blue-300 hover:shadow-xl transition-all"
            >
              <h2 className="text-lg font-semibold text-gray-900">创建家庭</h2>
              <p className="mt-1 text-sm text-gray-500">
                创建新的家庭空间，您将成为家长
              </p>
            </button>

            <button
              onClick={() => setStep("join")}
              className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-left hover:border-blue-300 hover:shadow-xl transition-all"
            >
              <h2 className="text-lg font-semibold text-gray-900">加入家庭</h2>
              <p className="mt-1 text-sm text-gray-500">
                使用邀请码加入现有家庭
              </p>
            </button>
          </div>
        )}

        {step === "create" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <button
                onClick={() => setStep("select")}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                返回
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                创建家庭
              </h2>
              <CreateHouseholdForm onSuccess={handleCreateSuccess} />
            </div>
          </div>
        )}

        {step === "join" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <button
                onClick={() => setStep("select")}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                返回
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                加入家庭
              </h2>
              <JoinHouseholdForm />
            </div>
          </div>
        )}

        {step === "success" && inviteCode && (
          <InviteCodeSuccess inviteCode={inviteCode} />
        )}

        {step === "select" && (
          <p className="text-center text-sm text-gray-500">
            创建家庭后您将成为家长，可以邀请其他成员加入
          </p>
        )}
      </div>
    </div>
  );
}
