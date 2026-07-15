import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingRoleSelector } from "@/components/OnboardingRoleSelector";

export default async function OnboardingRootPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.onboardingComplete) {
    redirect("/dashboard");
  }

  // Always show the role selector at the root of /onboarding so the user 
  // can explicitly choose their path.
  return <OnboardingRoleSelector />;
}
