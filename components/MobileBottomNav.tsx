"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Calendar, MessageCircle, BookOpen } from "lucide-react";

interface MobileBottomNavProps {
  userRole: "mentee" | "mentor" | "admin";
}

export function MobileBottomNav({ userRole }: MobileBottomNavProps) {
  const pathname = usePathname();

  // Bottom nav doesn't apply to admin
  if (userRole === "admin") return null;

  const dashboardHref = userRole === "mentee" ? "/dashboard/mentee" : "/dashboard/mentor";

  const links = [
    { href: dashboardHref, label: "Dashboard", icon: Home },
    { href: "/dashboard/mentee/mentors", label: "Mentors", icon: Users, hideForMentor: true },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/resources", label: "Resources", icon: BookOpen },
  ].filter(link => !(link.hideForMentor && userRole === "mentor"));

  const isActive = (href: string) => {
    if (href === "/dashboard/mentee" || href === "/dashboard/mentor") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[90] lg:hidden">
      {/* Safe area padding wrapper */}
      <div className="bg-background/95 backdrop-blur-md border-t border-border pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <nav className="flex items-center justify-around px-2 py-2">
          {links.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center min-w-[64px] gap-1 p-1 tap-highlight-transparent"
              >
                <div
                  className={`flex items-center justify-center transition-all duration-200 ${
                    active
                      ? "text-amber-500 scale-110"
                      : "text-muted-foreground scale-100"
                  }`}
                >
                  <Icon
                    className="w-[22px] h-[22px]"
                    strokeWidth={active ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    active ? "text-amber-500" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
