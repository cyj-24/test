"use client";

import { useState, useTransition } from "react";
import { completeChore, assignChore } from "@/app/actions";
import { cn } from "@/lib/utils";

interface ChoreAssignment {
  id: string;
  memberId: string;
  memberName: string;
  done: boolean;
}

interface Chore {
  id: string;
  title: string;
  assignment: ChoreAssignment | null;
}

interface Member {
  id: string;
  name: string;
}

interface ChoreRowProps {
  chore: Chore;
  members: Member[];
}

export function ChoreRow({ chore, members }: ChoreRowProps) {
  const [done, setDone] = useState(chore.assignment?.done ?? false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (!chore.assignment) return;

    const newDone = !done;
    setDone(newDone);

    startTransition(async () => {
      try {
        await completeChore(chore.assignment!.id, newDone);
      } catch {
        setDone(!newDone);
      }
    });
  };

  const handleAssign = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const memberId = e.target.value;
    if (!memberId) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("choreId", chore.id);
      formData.append("memberId", memberId);
      await assignChore(formData);
    });
  };

  return (
    <tr className={cn("hover:bg-gray-50", isPending && "opacity-50")}>
      <td className="px-4 py-3 text-sm text-gray-900">{chore.title}</td>
      <td className="px-4 py-3">
        {chore.assignment ? (
          <span className="text-sm text-gray-900">
            {chore.assignment.memberName}
          </span>
        ) : (
          <select
            onChange={handleAssign}
            defaultValue=""
            disabled={isPending}
            className="text-sm text-gray-500 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">选择负责人</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        {chore.assignment ? (
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center mx-auto transition-colors",
              done
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-blue-500"
            )}
          >
            {done && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>
    </tr>
  );
}
