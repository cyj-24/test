"use client";

import { Role } from "@prisma/client";
import { MemberRoleSelect } from "./MemberRoleSelect";

interface Member {
  id: string;
  name: string;
  role: Role;
  isCurrentUser: boolean;
}

interface MemberListProps {
  members: Member[];
  isParent: boolean;
  currentMemberId: string;
}

export function MemberList({ members, isParent, currentMemberId }: MemberListProps) {
  return (
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
                  {member.isCurrentUser && (
                    <span className="ml-2 text-xs text-gray-400">(我)</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {member.role === Role.PARENT ? "家长" : "成员"}
                </div>
              </div>
            </div>

            {isParent && member.id !== currentMemberId && (
              <MemberRoleSelect memberId={member.id} role={member.role} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
