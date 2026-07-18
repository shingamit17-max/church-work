import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminOnboardingSettings } from "@/components/admin/AdminOnboardingSettings";

export default async function AdminQuestionsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <AdminOnboardingSettings />
    </div>
  );
}
