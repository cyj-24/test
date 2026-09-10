import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const household = await prisma.household.create({
    data: {
      name: "示范家庭",
      inviteCode: "DEMO01",
    },
  });

  console.log(`✅ Created household: ${household.name}`);

  const parent = await prisma.member.create({
    data: {
      householdId: household.id,
      name: "张妈妈",
      role: Role.PARENT,
    },
  });

  const member1 = await prisma.member.create({
    data: {
      householdId: household.id,
      name: "小明",
      role: Role.MEMBER,
    },
  });

  const member2 = await prisma.member.create({
    data: {
      householdId: household.id,
      name: "小红",
      role: Role.MEMBER,
    },
  });

  console.log(`✅ Created ${3} members`);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.todo.createMany({
    data: [
      {
        householdId: household.id,
        title: "买牛奶",
        assigneeId: parent.id,
        dueDate: today,
        done: false,
      },
      {
        householdId: household.id,
        title: "交水电费",
        assigneeId: parent.id,
        dueDate: tomorrow,
        done: false,
      },
      {
        householdId: household.id,
        title: "完成数学作业",
        assigneeId: member1.id,
        dueDate: today,
        done: false,
      },
      {
        householdId: household.id,
        title: "练习钢琴30分钟",
        assigneeId: member2.id,
        dueDate: today,
        done: true,
      },
      {
        householdId: household.id,
        title: "预约牙医",
        assigneeId: null,
        dueDate: null,
        done: false,
      },
    ],
  });

  console.log(`✅ Created 5 todos`);

  const chores = await Promise.all([
    prisma.chore.create({
      data: {
        householdId: household.id,
        title: "洗碗",
      },
    }),
    prisma.chore.create({
      data: {
        householdId: household.id,
        title: "扫地拖地",
      },
    }),
    prisma.chore.create({
      data: {
        householdId: household.id,
        title: "倒垃圾",
      },
    }),
    prisma.chore.create({
      data: {
        householdId: household.id,
        title: "整理房间",
      },
    }),
  ]);

  console.log(`✅ Created ${chores.length} chores`);

  const weekStart = getStartOfWeek(today);

  await prisma.choreAssignment.createMany({
    data: [
      {
        choreId: chores[0].id,
        memberId: member1.id,
        weekStart,
        done: false,
      },
      {
        choreId: chores[1].id,
        memberId: member2.id,
        weekStart,
        done: true,
      },
      {
        choreId: chores[2].id,
        memberId: parent.id,
        weekStart,
        done: false,
      },
    ],
  });

  console.log(`✅ Created 3 chore assignments`);

  console.log("\n🎉 Seeding completed!");
  console.log(`\n📋 Demo household invite code: ${household.inviteCode}`);
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
