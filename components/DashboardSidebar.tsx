'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface DashboardSidebarProps {
  userRole: 'mentee' | 'mentor';
  userName: string;
  userEmail?: string;
}

const MENTEE_LINKS = [
  { href: '/dashboard/mentee', label: 'Dashboard', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  )},
  { href: '/dashboard/mentee/profile', label: 'My Profile', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
  )},
  { href: '/dashboard/mentee/mentors', label: 'Find Mentors', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M2 20c0-3.3 3.1-6 7-6"/><circle cx="17" cy="11" r="3"/><path d="M14 20c0-2.2 1.3-4 3-4s3 1.8 3 4"/></svg>
  )},
  { href: '/dashboard/mentee/placements', label: 'Job Board', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
  )},
  { href: '/dashboard/mentee/network', label: 'My Network', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M6 6.5l4 4M14 9.5l4-3M6 17.5l4-4M14 14.5l4 3"/></svg>
  )},
  { href: '/events', label: 'Events', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
  )},
  { href: '/resources', label: 'Resources', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
  )},
];

const MENTOR_LINKS = [
  { href: '/dashboard/mentor', label: 'Dashboard', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  )},
  { href: '/dashboard/mentor/profile', label: 'My Profile', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
  )},
  { href: '/events', label: 'Events', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
  )},
  { href: '/resources', label: 'Resources', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
  )},
];

export function DashboardSidebar({ userRole, userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const links = userRole === 'mentee' ? MENTEE_LINKS : MENTOR_LINKS;
  const isActive = (href: string) => pathname === href || (href !== '/dashboard/mentee' && href !== '/dashboard/mentor' && pathname.startsWith(href));

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 lg:hidden z-50 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
        style={{ background: 'rgba(41,37,36,0.9)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
        aria-label="Menu"
      >
        {isOpen ? (
          <svg width="16" height="16" fill="none" stroke="#fafaf9" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="16" height="16" fill="none" stroke="#fafaf9" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 lg:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-64 h-screen z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: '#1a1714',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 2px 8px rgba(245,158,11,0.3)' }}
          >
            ✦
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ letterSpacing: '-0.02em', color: '#fafaf9' }}>
            Grace Mentor
          </span>
        </div>

        {/* User */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0c0a09' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#fafaf9' }}>{userName}</p>
              <p className="text-xs truncate" style={{ color: '#57534e' }}>
                {userRole === 'mentee' ? 'Job Seeker' : 'Mentor'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: '#44403c' }}>
            Navigation
          </p>
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group"
                style={{
                  background: active ? 'rgba(245,158,11,0.12)' : 'transparent',
                  color: active ? '#fbbf24' : '#78716c',
                  fontWeight: active ? 500 : 400,
                  border: active ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#d6d3d1';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#78716c';
                  }
                }}
              >
                <span style={{ color: active ? '#f59e0b' : 'currentColor', flexShrink: 0 }}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: '#57534e' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#d6d3d1'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#57534e'; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
            Settings
          </Link>
          <button
            onClick={() => { window.location.href = '/api/auth/signout'; }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: '#57534e' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fb7185'; e.currentTarget.style.background = 'rgba(244,63,94,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#57534e'; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
