"use client";

import { useRef } from "react";
import { createChore } from "@/app/actions";

export function CreateChoreForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await createChore(formData);
    formRef.current?.reset();
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <input
          type="text"
          name="title"
          placeholder="添加新家务..."
          className="flex-1 text-sm placeholder-gray-400 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          添加
        </button>
      </div>
    </form>
  );
}
