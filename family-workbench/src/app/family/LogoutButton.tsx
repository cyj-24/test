"use client";

import { logout } from "@/app/actions";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
    >
      退出登录
    </button>
  );
}
