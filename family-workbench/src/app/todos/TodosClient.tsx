"use client";

import { useState } from "react";
import Link from "next/link";
import { TodoListItem } from "./TodoListItem";
import { CreateTodoModal } from "./CreateTodoModal";
import { EditTodoModal } from "./EditTodoModal";

interface Todo {
  id: string;
  title: string;
  assigneeId: string | null;
  dueDate: string | null;
  done: boolean;
  assignee: { id: string; name: string } | null;
}

interface Member {
  id: string;
  name: string;
}

interface TodosClientProps {
  initialTodos: Todo[];
  members: Member[];
}

export function TodosClient({ initialTodos, members }: TodosClientProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const pendingTodos = initialTodos.filter((t) => !t.done);
  const completedTodos = initialTodos.filter((t) => t.done);
  const displayedTodos = showCompleted
    ? initialTodos
    : pendingTodos;

  const handleEmptyClick = () => {
    setShowCreateModal(true);
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
          <h1 className="text-lg font-semibold text-gray-900">待办</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            新建
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Toggle completed */}
        {completedTodos.length > 0 && (
          <div className="flex items-center justify-end">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              显示已完成 ({completedTodos.length})
            </label>
          </div>
        )}

        {/* Todo list */}
        {displayedTodos.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {displayedTodos.map((todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onEdit={() => setEditingTodo(todo)}
              />
            ))}
          </div>
        ) : pendingTodos.length === 0 ? (
          <button
            onClick={handleEmptyClick}
            className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-12 text-center hover:bg-gray-50 transition-colors"
          >
            <p className="text-gray-500">还没有待办，去添加</p>
          </button>
        ) : null}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <CreateTodoModal
          members={members}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit modal */}
      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          members={members}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
}
