import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStartOfWeek } from "@/lib/utils";
import { ChoresClient } from "./ChoresClient";

export const dynamic = "force-dynamic";

export default async function ChoresPage() {
  const member = await getCurrentMember();

  if (!member) {
    redirect("/onboarding");
  }

  const weekStart = getStartOfWeek();

  const chores = await prisma.chore.findMany({
    where: {
      householdId: member.householdId,
    },
    include: {
      assignments: {
        where: { weekStart },
        include: { member: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const members = await prisma.member.findMany({
    where: { householdId: member.householdId },
    orderBy: { name: "asc" },
  });

  const serializedChores = chores.map((chore) => ({
    id: chore.id,
    title: chore.title,
    assignment: chore.assignments[0]
      ? {
          id: chore.assignments[0].id,
          memberId: chore.assignments[0].memberId,
          memberName: chore.assignments[0].member.name,
          done: chore.assignments[0].done,
        }
      : null,
  }));

  const serializedMembers = members.map((m) => ({
    id: m.id,
    name: m.name,
  }));

  return (
    <ChoresClient
      chores={serializedChores}
      members={serializedMembers}
      weekStart={weekStart.toISOString()}
    />
  );
}
