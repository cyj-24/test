"use client";

import { useTransition } from "react";
import { updateTodo } from "@/app/actions";

interface Todo {
  id: string;
  title: string;
  assigneeId: string | null;
  dueDate: string | null;
  done: boolean;
}

interface Member {
  id: string;
  name: string;
}

interface EditTodoModalProps {
  todo: Todo;
  members: Member[];
  onClose: () => void;
}

export function EditTodoModal({ todo, members, onClose }: EditTodoModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await updateTodo(todo.id, {
        assigneeId: formData.get("assigneeId") as string | null,
        dueDate: formData.get("dueDate") as string | null,
      });
      onClose();
    });
  };

  const dueDateValue = todo.dueDate
    ? new Date(todo.dueDate).toISOString().split("T")[0]
    : "";

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
          <h2 className="text-base font-semibold text-gray-900">编辑待办</h2>
          <button
            type="submit"
            form="edit-todo-form"
            disabled={isPending}
            className="text-blue-600 font-medium hover:text-blue-700 disabled:opacity-50"
          >
            {isPending ? "保存中" : "保存"}
          </button>
        </div>

        <form
          id="edit-todo-form"
          action={handleSubmit}
          className="p-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标题
            </label>
            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
              {todo.title}
            </div>
          </div>

          <div>
            <label
              htmlFor="assigneeId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              负责人
            </label>
            <select
              id="assigneeId"
              name="assigneeId"
              defaultValue={todo.assigneeId || ""}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">不指定</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              截止日期
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              defaultValue={dueDateValue}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
