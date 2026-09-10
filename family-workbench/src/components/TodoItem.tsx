"use client";

import { useState, useTransition } from "react";
import { completeTodo } from "@/app/actions";
import { cn, isOverdue, isToday, formatDate } from "@/lib/utils";

interface TodoItemProps {
  id: string;
  title: string;
  assigneeName?: string | null;
  dueDate?: Date | null;
  done: boolean;
}

export function TodoItem({
  id,
  title,
  assigneeName,
  dueDate,
  done: initialDone,
}: TodoItemProps) {
  const [done, setDone] = useState(initialDone);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newDone = !done;
    setDone(newDone);

    startTransition(async () => {
      try {
        await completeTodo(id, newDone);
      } catch {
        setDone(!newDone);
      }
    });
  };

  const dueDateObj = dueDate ? new Date(dueDate) : null;
  const isUrgent =
    dueDateObj && !done && (isOverdue(dueDateObj) || isToday(dueDateObj));

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors",
        isPending && "opacity-50"
      )}
    >
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
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

      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "text-sm",
            done ? "text-gray-400 line-through" : "text-gray-900"
          )}
        >
          {title}
        </span>
      </div>

      {assigneeName && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
          {assigneeName}
        </span>
      )}

      {dueDateObj && (
        <span
          className={cn(
            "text-xs flex-shrink-0",
            isUrgent ? "text-red-500 font-medium" : "text-gray-400"
          )}
        >
          {formatDate(dueDateObj)}
        </span>
      )}
    </div>
  );
}
