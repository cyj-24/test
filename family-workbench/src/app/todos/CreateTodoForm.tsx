"use client";

import { useRef, useState } from "react";
import { createTodo } from "@/app/actions";
import type { Member } from "@prisma/client";

interface CreateTodoFormProps {
  members: Member[];
}

export function CreateTodoForm({ members }: CreateTodoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await createTodo(formData);
    formRef.current?.reset();
    setIsExpanded(false);
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="px-4 py-3">
        <input
          type="text"
          name="title"
          placeholder="添加待办事项..."
          className="w-full text-sm placeholder-gray-400 focus:outline-none"
          onFocus={() => setIsExpanded(true)}
          required
        />
      </div>

      {isExpanded && (
        <div className="px-4 pb-3 space-y-3 border-t border-gray-100 pt-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">负责人</label>
              <select
                name="assigneeId"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">不指定</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">截止日期</label>
              <input
                type="date"
                name="dueDate"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                formRef.current?.reset();
                setIsExpanded(false);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              添加
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
