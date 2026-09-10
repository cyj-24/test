import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import { OnboardingClient } from "./OnboardingClient";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const member = await getCurrentMember();

  if (member) {
    redirect("/");
  }

  return <OnboardingClient />;
}
