"use client";

import { useState } from "react";
import Link from "next/link";
import { ChoreRow } from "./ChoreRow";
import { AddChoreModal } from "./AddChoreModal";

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

interface ChoresClientProps {
  chores: Chore[];
  members: Member[];
  weekStart: string;
}

export function ChoresClient({ chores, members, weekStart }: ChoresClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const weekStartDate = new Date(weekStart);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const formatWeekRange = () => {
    return `${weekStartDate.getMonth() + 1}/${weekStartDate.getDate()} - ${
      weekEndDate.getMonth() + 1
    }/${weekEndDate.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5"
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
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">轮值</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            添加家务
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Week info */}
        <div className="text-sm text-gray-500 text-center">
          本周 {formatWeekRange()}
        </div>

        {/* Chores table */}
        {chores.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    家务
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    今日责任人
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    完成
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chores.map((chore) => (
                  <ChoreRow
                    key={chore.id}
                    chore={chore}
                    members={members}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-12 text-center hover:bg-gray-50 transition-colors"
          >
            <p className="text-gray-500">还没有家务，去添加</p>
          </button>
        )}
      </div>

      {/* Add modal */}
      {showAddModal && (
        <AddChoreModal
          members={members}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
