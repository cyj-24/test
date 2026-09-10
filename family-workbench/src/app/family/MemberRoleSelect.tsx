"use client";

import { updateMemberRole } from "@/app/actions";
import { Role } from "@prisma/client";

interface MemberRoleSelectProps {
  memberId: string;
  role: Role;
}

export function MemberRoleSelect({ memberId, role }: MemberRoleSelectProps) {
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    await updateMemberRole(memberId, newRole);
  };

  return (
    <select
      value={role}
      onChange={handleChange}
      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value={Role.PARENT}>家长</option>
      <option value={Role.MEMBER}>成员</option>
    </select>
  );
}
