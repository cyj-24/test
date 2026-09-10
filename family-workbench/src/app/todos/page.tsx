import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TopBar } from "@/components/TopBar";
import { TodoItem } from "@/components/TodoItem";
import { CreateTodoForm } from "./CreateTodoForm";

export const dynamic = "force-dynamic";

export default async function TodosPage() {
  const member = await getCurrentMember();

  if (!member) {
    redirect("/onboarding");
  }

  const todos = await prisma.todo.findMany({
    where: {
      householdId: member.householdId,
    },
    include: {
      assignee: true,
    },
    orderBy: [{ done: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  });

  const members = await prisma.member.findMany({
    where: { householdId: member.householdId },
    orderBy: { name: "asc" },
  });

  const pendingTodos = todos.filter((t) => !t.done);
  const completedTodos = todos.filter((t) => t.done);

  return (
    <div className="min-h-screen">
      <TopBar householdName={member.household.name} memberName={member.name} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">待办事项</h1>
        </div>

        <CreateTodoForm members={members} />

        {pendingTodos.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-500">
                待完成 ({pendingTodos.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {pendingTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  assigneeName={todo.assignee?.name}
                  dueDate={todo.dueDate}
                  done={todo.done}
                />
              ))}
            </div>
          </section>
        )}

        {completedTodos.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-500">
                已完成 ({completedTodos.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  assigneeName={todo.assignee?.name}
                  dueDate={todo.dueDate}
                  done={todo.done}
                />
              ))}
            </div>
          </section>
        )}

        {todos.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-12 text-center">
            <p className="text-gray-500">还没有待办事项</p>
            <p className="text-sm text-gray-400 mt-1">在上方添加第一个待办</p>
          </div>
        )}
      </div>
    </div>
  );
}
