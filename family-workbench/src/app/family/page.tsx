import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { FamilyClient } from "./FamilyClient";

export const dynamic = "force-dynamic";

export default async function FamilyPage() {
  const currentMember = await getCurrentMember();

  if (!currentMember) {
    redirect("/onboarding");
  }

  const members = await prisma.member.findMany({
    where: { householdId: currentMember.householdId },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  const isParent = currentMember.role === Role.PARENT;

  const serializedMembers = members.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    isCurrentUser: m.id === currentMember.id,
  }));

  return (
    <FamilyClient
      members={serializedMembers}
      isParent={isParent}
      inviteCode={isParent ? currentMember.household.inviteCode : null}
      currentMemberId={currentMember.id}
    />
  );
}
