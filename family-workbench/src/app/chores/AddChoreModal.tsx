"use client";

import { useState, useTransition } from "react";
import { createChoreWithAssignment } from "@/app/actions";

interface Member {
  id: string;
  name: string;
}

interface AddChoreModalProps {
  members: Member[];
  onClose: () => void;
}

export function AddChoreModal({ members, onClose }: AddChoreModalProps) {
  const [title, setTitle] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      await createChoreWithAssignment(title, selectedMembers);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            取消
          </button>
          <h2 className="text-base font-semibold text-gray-900">添加家务</h2>
          <button
            onClick={handleSubmit}
            disabled={isPending || !title.trim()}
            className="text-blue-600 font-medium hover:text-blue-700 disabled:opacity-50"
          >
            {isPending ? "保存中" : "保存"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              家务名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              placeholder="例如：洗碗、扫地"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              本周负责人
            </label>
            <div className="space-y-2">
              {members.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => handleToggleMember(member.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">{member.name}</span>
                  {selectedMembers.indexOf(member.id) === 0 && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      本周
                    </span>
                  )}
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              选择多人时，第一个选中的人为本周负责人
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
