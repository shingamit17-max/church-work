'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface DashboardSidebarProps {
  userRole: 'mentee' | 'mentor';
  userName: string;
  userEmail: string;
}

export function DashboardSidebar({ userRole, userName, userEmail }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menteeLinks = [
    { href: '/dashboard/mentee', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/mentee/profile', label: 'My Profile', icon: '👤' },
    { href: '/dashboard/mentee/placements', label: 'Job Opportunities', icon: '💼' },
    { href: '/dashboard/mentee/mentors', label: 'Find Mentors', icon: '🎓' },
    { href: '/dashboard/mentee/network', label: 'My Network', icon: '🤝' },
    { href: '/dashboard/mentee/resources', label: 'Resources', icon: '📚' },
  ];

  const mentorLinks = [
    { href: '/dashboard/mentor', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/mentor/profile', label: 'My Profile', icon: '👤' },
    { href: '/dashboard/mentor/mentees', label: 'My Mentees', icon: '👥' },
    { href: '/dashboard/mentor/placements', label: 'Job Board', icon: '💼' },
    { href: '/dashboard/mentor/network', label: 'Network', icon: '🤝' },
    { href: '/dashboard/mentor/resources', label: 'Resources', icon: '📚' },
  ];

  const links = userRole === 'mentee' ? menteeLinks : mentorLinks;

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 lg:hidden z-50 p-2 rounded-lg bg-slate-700 dark:bg-slate-600 text-white hover:bg-slate-800 dark:hover:bg-slate-500"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Grace Work</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Professional Network</p>
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
            {userName.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-base truncate">{userName}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-3">{userEmail}</p>
          <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium capitalize">
            {userRole === 'mentee' ? '🎓 Job Seeker' : '👨‍💼 Mentor'}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(link.href)
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium border-l-4 border-slate-700 dark:border-slate-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="flex-1">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-6 space-y-2">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </Link>
          <button
            onClick={() => {
              // Logout logic
              window.location.href = '/api/auth/logout';
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
