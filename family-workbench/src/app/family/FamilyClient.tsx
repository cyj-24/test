"use client";

import Link from "next/link";
import { Role } from "@prisma/client";
import { InviteCodeBar } from "./InviteCodeBar";
import { MemberList } from "./MemberList";
import { LogoutButton } from "./LogoutButton";

interface Member {
  id: string;
  name: string;
  role: Role;
  isCurrentUser: boolean;
}

interface FamilyClientProps {
  members: Member[];
  isParent: boolean;
  inviteCode: string | null;
  currentMemberId: string;
}

export function FamilyClient({
  members,
  isParent,
  inviteCode,
  currentMemberId,
}: FamilyClientProps) {
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
          <h1 className="text-lg font-semibold text-gray-900">家人</h1>
          <div className="w-5" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Invite code bar */}
        <InviteCodeBar isParent={isParent} inviteCode={inviteCode} />

        {/* Member list */}
        <MemberList
          members={members}
          isParent={isParent}
          currentMemberId={currentMemberId}
        />

        {/* Account section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-500">账号</h2>
          </div>
          <div className="px-4 py-4">
            <LogoutButton />
          </div>
        </section>
      </div>
    </div>
  );
}
