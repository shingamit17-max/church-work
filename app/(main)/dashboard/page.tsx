import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardIndexPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "mentee") {
    redirect("/dashboard/mentee");
  } else if (session.user.role === "mentor") {
    redirect("/dashboard/mentor");
  } else if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  } else {
    redirect("/login");
  }
}
