'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Image from "next/image";

interface DashboardSidebarProps {
  userRole: 'mentee' | 'mentor' | 'admin';
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

const ADMIN_LINKS = [
  { href: '/dashboard/admin', label: 'Admin Dashboard', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  )},
  { href: '/events', label: 'Events', icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
  )},
];

export function DashboardSidebar({ userRole, userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);
  const links = userRole === 'admin' ? ADMIN_LINKS : userRole === 'mentee' ? MENTEE_LINKS : MENTOR_LINKS;
  const isActive = (href: string) => pathname === href || (href !== '/dashboard/mentee' && href !== '/dashboard/mentor' && href !== '/dashboard/admin' && pathname.startsWith(href));

  return (
    <>
      {/* Mobile Header (Opaque Pill - Hidden when Sidebar is Open) */}
      <div className={`fixed top-6 w-full px-4 flex lg:hidden justify-center z-[80] pointer-events-none transition-all duration-300 ${isOpen ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div 
          className="flex items-center justify-between w-full max-w-sm px-4 py-3 rounded-full pointer-events-auto"
          style={{ 
            background: "#292524", // Solid color, not see-through
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)" // Stronger shadow for depth since it's solid
          }}
        >
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Grace Mentor Logo" width={28} height={28} className="h-7 w-auto object-contain" />
            <span className="font-semibold text-base text-foreground" style={{ letterSpacing: "-0.02em" }}>Grace Mentor</span>
          </div>
          
          {/* Hamburger Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{ background: isOpen ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.05)" }}
            aria-label="Menu"
          >
            {isOpen ? (
              <svg width="16" height="16" fill="none" stroke="#fafaf9" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="#fafaf9" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 lg:hidden z-[60] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-screen lg:relative w-64 z-[70] flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'} bg-card`}
        style={{
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Desktop Logo */}
        <div className="hidden lg:flex items-center gap-2.5 px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <Image src="/logo.png" alt="Grace Mentor" width={32} height={32} className="h-8 w-auto object-contain" />
          <span className="font-bold text-foreground text-xl">Grace Mentor</span>
        </div>

        {/* Mobile Logo & Close Button (Inside Sidebar) */}
        <div className="flex lg:hidden items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Grace Mentor" width={28} height={28} className="h-7 w-auto object-contain" />
            <span className="font-bold text-foreground text-base">Grace Mentor</span>
          </div>
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
            style={{ background: "rgba(255, 255, 255, 0.15)" }}
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <svg width="16" height="16" fill="none" stroke="#fafaf9" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* User */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'bg-foreground/5' }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#fafaf9' }}>{userName}</p>
              <p className="text-xs truncate" style={{ color: '#57534e' }}>
                {userRole === 'admin' ? 'Administrator' : userRole === 'mentee' ? 'Job Seeker' : 'Mentor'}
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
                    e.currentTarget.style.background = 'bg-foreground/5';
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
        <div className="px-3 py-4 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: '#57534e' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#d6d3d1'; e.currentTarget.style.background = 'bg-foreground/5'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#57534e'; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
            Settings
          </Link>
          <button
            onClick={() => setShowSignoutConfirm(true)}
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

      {/* Sign Out Confirmation Modal */}
      {showSignoutConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="p-6 max-w-sm w-full rounded-2xl animate-in fade-in zoom-in duration-200 bg-card border border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">Sign Out</h3>
            <p className="text-muted-foreground mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSignoutConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex-1 px-4 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
