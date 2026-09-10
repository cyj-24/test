"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  setSession,
  clearSession,
  generateInviteCode,
  requireAuth,
} from "@/lib/auth";
import { getStartOfWeek } from "@/lib/utils";
import { Role } from "@prisma/client";

export async function completeTodo(id: string, done: boolean) {
  const member = await requireAuth();

  await prisma.todo.update({
    where: {
      id,
      householdId: member.householdId,
    },
    data: { done },
  });

  revalidatePath("/");
  revalidatePath("/todos");
}

export async function completeChore(id: string, done: boolean) {
  const member = await requireAuth();

  const assignment = await prisma.choreAssignment.findFirst({
    where: {
      id,
      chore: { householdId: member.householdId },
    },
  });

  if (!assignment) {
    throw new Error("Chore assignment not found");
  }

  await prisma.choreAssignment.update({
    where: { id },
    data: { done },
  });

  revalidatePath("/");
  revalidatePath("/chores");
}

export async function createHousehold(formData: FormData) {
  const householdName = formData.get("householdName") as string;
  const memberName = formData.get("memberName") as string;

  if (!householdName?.trim() || !memberName?.trim()) {
    throw new Error("名称不能为空");
  }

  const inviteCode = generateInviteCode();

  const household = await prisma.household.create({
    data: {
      name: householdName.trim(),
      inviteCode,
      members: {
        create: {
          name: memberName.trim(),
          role: Role.PARENT,
        },
      },
    },
    include: {
      members: true,
    },
  });

  const member = household.members[0];

  await setSession({
    memberId: member.id,
    householdId: household.id,
  });

  redirect("/");
}

export async function joinHousehold(formData: FormData) {
  const inviteCode = formData.get("inviteCode") as string;
  const memberName = formData.get("memberName") as string;

  if (!inviteCode?.trim() || !memberName?.trim()) {
    throw new Error("邀请码和名称不能为空");
  }

  const household = await prisma.household.findUnique({
    where: { inviteCode: inviteCode.trim().toUpperCase() },
  });

  if (!household) {
    throw new Error("邀请码无效");
  }

  const member = await prisma.member.create({
    data: {
      householdId: household.id,
      name: memberName.trim(),
      role: Role.MEMBER,
    },
  });

  await setSession({
    memberId: member.id,
    householdId: household.id,
  });

  redirect("/");
}

export async function createTodo(formData: FormData) {
  const member = await requireAuth();

  const title = formData.get("title") as string;
  const assigneeId = formData.get("assigneeId") as string | null;
  const dueDateStr = formData.get("dueDate") as string | null;

  if (!title?.trim()) {
    throw new Error("标题不能为空");
  }

  await prisma.todo.create({
    data: {
      householdId: member.householdId,
      title: title.trim(),
      assigneeId: assigneeId || null,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/todos");
}

export async function deleteTodo(id: string) {
  const member = await requireAuth();

  await prisma.todo.delete({
    where: {
      id,
      householdId: member.householdId,
    },
  });

  revalidatePath("/");
  revalidatePath("/todos");
}

export async function createChore(formData: FormData) {
  const member = await requireAuth();

  const title = formData.get("title") as string;

  if (!title?.trim()) {
    throw new Error("标题不能为空");
  }

  await prisma.chore.create({
    data: {
      householdId: member.householdId,
      title: title.trim(),
    },
  });

  revalidatePath("/chores");
}

export async function assignChore(formData: FormData) {
  const member = await requireAuth();

  const choreId = formData.get("choreId") as string;
  const memberId = formData.get("memberId") as string;

  if (!choreId || !memberId) {
    throw new Error("请选择家务和成员");
  }

  const chore = await prisma.chore.findFirst({
    where: {
      id: choreId,
      householdId: member.householdId,
    },
  });

  if (!chore) {
    throw new Error("家务不存在");
  }

  const weekStart = getStartOfWeek();

  await prisma.choreAssignment.upsert({
    where: {
      choreId_weekStart: {
        choreId,
        weekStart,
      },
    },
    update: {
      memberId,
      done: false,
    },
    create: {
      choreId,
      memberId,
      weekStart,
    },
  });

  revalidatePath("/");
  revalidatePath("/chores");
}

export async function deleteChore(id: string) {
  const member = await requireAuth();

  await prisma.chore.delete({
    where: {
      id,
      householdId: member.householdId,
    },
  });

  revalidatePath("/chores");
}

export async function inviteMember() {
  const member = await requireAuth();

  if (member.role !== Role.PARENT) {
    throw new Error("只有家长可以邀请成员");
  }

  return member.household.inviteCode;
}

export async function updateMemberRole(memberId: string, role: Role) {
  const member = await requireAuth();

  if (member.role !== Role.PARENT) {
    throw new Error("只有家长可以修改角色");
  }

  await prisma.member.update({
    where: {
      id: memberId,
      householdId: member.householdId,
    },
    data: { role },
  });

  revalidatePath("/family");
}

export async function logout() {
  await clearSession();
  redirect("/onboarding");
}
