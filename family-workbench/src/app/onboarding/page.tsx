import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import { CreateHouseholdForm } from "./CreateHouseholdForm";
import { JoinHouseholdForm } from "./JoinHouseholdForm";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const member = await getCurrentMember();

  if (member) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">家庭管理工作台</h1>
          <p className="mt-2 text-gray-600">
            一起管理家庭待办事项和家务分配
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                创建新家庭
              </h2>
              <CreateHouseholdForm />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">或者</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                加入现有家庭
              </h2>
              <JoinHouseholdForm />
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          创建家庭后您将成为家长，可以邀请其他成员加入
        </p>
      </div>
    </div>
  );
}
