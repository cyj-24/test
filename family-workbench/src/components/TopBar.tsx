import Link from "next/link";

interface TopBarProps {
  householdName: string;
  memberName?: string;
}

export function TopBar({ householdName, memberName }: TopBarProps) {
  const initial = memberName?.charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-40">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">{householdName}</h1>
        <Link
          href="/family"
          className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium hover:bg-blue-200 transition-colors"
          title={memberName || "家庭成员"}
        >
          {initial}
        </Link>
      </div>
    </header>
  );
}
