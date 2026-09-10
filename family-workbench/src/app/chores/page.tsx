import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TopBar } from "@/components/TopBar";
import { ChoreItem } from "@/components/ChoreItem";
import { CreateChoreForm } from "./CreateChoreForm";
import { AssignChoreForm } from "./AssignChoreForm";
import { getStartOfWeek } from "@/lib/utils";

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
    orderBy: { createdAt: "desc" },
  });

  const members = await prisma.member.findMany({
    where: { householdId: member.householdId },
    orderBy: { name: "asc" },
  });


  return (
    <div className="min-h-screen">
      <TopBar householdName={member.household.name} memberName={member.name} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">家务轮值</h1>
          <span className="text-sm text-gray-500">
            本周 {formatWeekRange(weekStart)}
          </span>
        </div>

        <CreateChoreForm />

        {chores.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-500">
                本周家务 ({chores.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      家务
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      负责人
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">
                      完成
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {chores.map((chore) => {
                    const assignment = chore.assignments[0];
                    return (
                      <tr key={chore.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {chore.title}
                        </td>
                        <td className="px-4 py-3">
                          {assignment ? (
                            <span className="text-sm text-gray-900">
                              {assignment.member.name}
                            </span>
                          ) : (
                            <AssignChoreForm
                              choreId={chore.id}
                              members={members}
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {assignment ? (
                            <ChoreCheckbox
                              assignmentId={assignment.id}
                              done={assignment.done}
                            />
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {chores.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-12 text-center">
            <p className="text-gray-500">还没有家务</p>
            <p className="text-sm text-gray-400 mt-1">在上方添加第一个家务</p>
          </div>
        )}

        {chores.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-500">本周进度</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {chores
                .filter((c) => c.assignments[0])
                .map((chore) => {
                  const assignment = chore.assignments[0];
                  return (
                    <ChoreItem
                      key={assignment.id}
                      id={assignment.id}
                      title={chore.title}
                      memberName={assignment.member.name}
                      done={assignment.done}
                    />
                  );
                })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ChoreCheckbox({
  assignmentId,
  done,
}: {
  assignmentId: string;
  done: boolean;
}) {
  return (
    <form>
      <input type="hidden" name="id" value={assignmentId} />
      <span
        className={`inline-block w-5 h-5 rounded-full border-2 ${
          done
            ? "bg-green-500 border-green-500"
            : "border-gray-300"
        }`}
      >
        {done && (
          <svg
            className="w-full h-full text-white p-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    </form>
  );
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return `${weekStart.getMonth() + 1}/${weekStart.getDate()} - ${
    weekEnd.getMonth() + 1
  }/${weekEnd.getDate()}`;
}
