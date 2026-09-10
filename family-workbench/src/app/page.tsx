import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TopBar } from "@/components/TopBar";
import { TodoItem } from "@/components/TodoItem";
import { ChoreItem } from "@/components/ChoreItem";
import { getEndOfDay, getStartOfWeek } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const member = await getCurrentMember();

  if (!member) {
    redirect("/onboarding");
  }

  const today = new Date();
  const endOfDay = getEndOfDay(today);
  const weekStart = getStartOfWeek(today);

  const todayTodos = await prisma.todo.findMany({
    where: {
      householdId: member.householdId,
      done: false,
      OR: [
        { dueDate: { lte: endOfDay } },
        { dueDate: null },
      ],
    },
    include: {
      assignee: true,
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    take: 5,
  });

  const todayChores = await prisma.choreAssignment.findMany({
    where: {
      chore: { householdId: member.householdId },
      weekStart: weekStart,
      done: false,
    },
    include: {
      chore: true,
      member: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="min-h-screen">
      <TopBar householdName={member.household.name} memberName={member.name} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 今日待办 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">今日待办</h2>
            <Link
              href="/todos"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              全部
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {todayTodos.length === 0 ? (
              <Link
                href="/todos"
                className="block px-4 py-6 text-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              >
                还没有，去添加
              </Link>
            ) : (
              todayTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  assigneeName={todo.assignee?.name}
                  dueDate={todo.dueDate}
                  done={todo.done}
                />
              ))
            )}
          </div>
        </section>

        {/* 今日轮值 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">今日轮值</h2>
            <Link
              href="/chores"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              全部
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {todayChores.length === 0 ? (
              <Link
                href="/chores"
                className="block px-4 py-6 text-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              >
                还没有，去添加
              </Link>
            ) : (
              todayChores.map((assignment) => (
                <ChoreItem
                  key={assignment.id}
                  id={assignment.id}
                  title={assignment.chore.title}
                  memberName={assignment.member.name}
                  done={assignment.done}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
