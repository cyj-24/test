"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  setSession,
  clearSession,
  generateInviteCode,
  normalizeInviteCode,
  isValidInviteCode,
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

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createHousehold(
  formData: FormData
): Promise<ActionResult<{ inviteCode: string }>> {
  const householdName = formData.get("householdName") as string;
  const memberName = formData.get("memberName") as string;

  if (!householdName?.trim()) {
    return { success: false, error: "请输入家庭名称" };
  }

  if (!memberName?.trim()) {
    return { success: false, error: "请输入您的名字" };
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

  return { success: true, data: { inviteCode } };
}

export async function joinHousehold(
  formData: FormData
): Promise<ActionResult> {
  const inviteCode = formData.get("inviteCode") as string;
  const memberName = formData.get("memberName") as string;

  if (!inviteCode?.trim()) {
    return { success: false, error: "请输入邀请码" };
  }

  const normalizedCode = normalizeInviteCode(inviteCode);

  if (!isValidInviteCode(normalizedCode)) {
    return { success: false, error: "邀请码格式无效，请输入6位字母数字" };
  }

  if (!memberName?.trim()) {
    return { success: false, error: "请输入您的名字" };
  }

  const household = await prisma.household.findUnique({
    where: { inviteCode: normalizedCode },
  });

  if (!household) {
    return { success: false, error: "邀请码无效，请检查后重试" };
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

export async function updateTodo(
  id: string,
  data: { assigneeId?: string | null; dueDate?: string | null }
) {
  const member = await requireAuth();

  await prisma.todo.update({
    where: {
      id,
      householdId: member.householdId,
    },
    data: {
      assigneeId: data.assigneeId === "" ? null : data.assigneeId,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/todos");
}

export async function createChoreWithAssignment(
  title: string,
  memberIds: string[]
) {
  const member = await requireAuth();

  if (!title?.trim()) {
    throw new Error("标题不能为空");
  }

  const weekStart = getStartOfWeek();

  const chore = await prisma.chore.create({
    data: {
      householdId: member.householdId,
      title: title.trim(),
    },
  });

  if (memberIds.length > 0) {
    await prisma.choreAssignment.create({
      data: {
        choreId: chore.id,
        memberId: memberIds[0],
        weekStart,
        done: false,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/chores");
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

export async function regenerateInviteCode(): Promise<ActionResult<{ inviteCode: string }>> {
  const member = await requireAuth();

  if (member.role !== Role.PARENT) {
    return { success: false, error: "只有家长可以重新生成邀请码" };
  }

  const newInviteCode = generateInviteCode();

  await prisma.household.update({
    where: { id: member.householdId },
    data: { inviteCode: newInviteCode },
  });

  revalidatePath("/family");

  return { success: true, data: { inviteCode: newInviteCode } };
}

export async function logout() {
  await clearSession();
  redirect("/onboarding");
}
