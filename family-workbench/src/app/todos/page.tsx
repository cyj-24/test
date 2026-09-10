import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TodosClient } from "./TodosClient";

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
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  const members = await prisma.member.findMany({
    where: { householdId: member.householdId },
    orderBy: { name: "asc" },
  });

  const serializedTodos = todos.map((todo) => ({
    ...todo,
    dueDate: todo.dueDate?.toISOString() || null,
    createdAt: todo.createdAt.toISOString(),
    assignee: todo.assignee
      ? {
          ...todo.assignee,
          createdAt: todo.assignee.createdAt.toISOString(),
        }
      : null,
  }));

  const serializedMembers = members.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <TodosClient
      initialTodos={serializedTodos}
      members={serializedMembers}
    />
  );
}
