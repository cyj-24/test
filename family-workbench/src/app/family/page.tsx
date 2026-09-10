import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TopBar } from "@/components/TopBar";
import { Role } from "@prisma/client";
import { InviteCodeDisplay } from "./InviteCodeDisplay";
import { MemberRoleSelect } from "./MemberRoleSelect";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function FamilyPage() {
  const currentMember = await getCurrentMember();

  if (!currentMember) {
    redirect("/onboarding");
  }

  const members = await prisma.member.findMany({
    where: { householdId: currentMember.householdId },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  const isParent = currentMember.role === Role.PARENT;

  return (
    <div className="min-h-screen">
      <TopBar
        householdName={currentMember.household.name}
        memberName={currentMember.name}
      />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-xl font-bold text-gray-900">家庭成员</h1>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-500">
              成员 ({members.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {member.name}
                      {member.id === currentMember.id && (
                        <span className="ml-2 text-xs text-gray-400">(我)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.role === Role.PARENT ? "家长" : "成员"}
                    </div>
                  </div>
                </div>

                {isParent && member.id !== currentMember.id && (
                  <MemberRoleSelect memberId={member.id} role={member.role} />
                )}
              </div>
            ))}
          </div>
        </section>

        {isParent && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-500">邀请新成员</h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-gray-600 mb-3">
                分享以下邀请码给家庭成员，他们可以使用此邀请码加入家庭。
              </p>
              <InviteCodeDisplay code={currentMember.household.inviteCode} />
            </div>
          </section>
        )}

        <section className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-500">账号</h2>
          </div>
          <div className="px-4 py-4">
            <LogoutButton />
          </div>
        </section>
      </div>
    </div>
  );
}
