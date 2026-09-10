"use client";

import { assignChore } from "@/app/actions";
import type { Member } from "@prisma/client";

interface AssignChoreFormProps {
  choreId: string;
  members: Member[];
}

export function AssignChoreForm({ choreId, members }: AssignChoreFormProps) {
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const memberId = e.target.value;
    if (!memberId) return;

    const formData = new FormData();
    formData.append("choreId", choreId);
    formData.append("memberId", memberId);
    await assignChore(formData);
  };

  return (
    <select
      onChange={handleChange}
      defaultValue=""
      className="text-sm text-gray-500 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">选择负责人</option>
      {members.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </select>
  );
}
