import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OnboardingRootPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.onboardingComplete) {
    redirect("/dashboard");
  }

  if (session.user.role === "mentee") {
    redirect("/onboarding/mentee");
  } else if (session.user.role === "mentor") {
    redirect("/onboarding/mentor");
  } else {
    // If somehow no role, redirect to a role selection or default to mentee
    // But our register flow forces a role.
    redirect("/login");
  }
}
