"use client";

import { useState, useTransition } from "react";
import type { User as UserType, UserRole } from "@/types";
import { updateUserRole, deleteUser } from "@/app/actions/admin";

interface UserManagementTableProps {
  initialUsers: UserType[];
}

export function UserManagementTable({ initialUsers }: UserManagementTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [isPending, startTransition] = useTransition();

  // Optimistic local state to immediately remove deleted users
  const [deletedUserIds, setDeletedUserIds] = useState<Set<string>>(new Set());
  
  // Filter users based on search query, role filter, and exclude deleted users
  const filteredUsers = initialUsers.filter((u) => {
    if (deletedUserIds.has(u._id.toString())) return false;
    
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase());
      
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (res.error) {
        alert(res.error);
      }
    });
  };

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to permanently delete user "${userName}"? This cannot be undone.`)) {
      setDeletedUserIds(prev => new Set(prev).add(userId));
      
      startTransition(async () => {
        const res = await deleteUser(userId);
        if (res.error) {
          alert(res.error);
          // Revert optimistic delete on error
          setDeletedUserIds(prev => {
            const next = new Set(prev);
            next.delete(userId);
            return next;
          });
        }
      });
    }
  };

  return (
    <section className="rounded-3xl p-8" style={{ background: "rgba(41,37,36,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold">User Management</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50 w-full md:w-64 transition-colors"
            />
          </div>
          
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "all" | UserRole)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none transition-colors"
          >
            <option value="all">All Roles</option>
            <option value="mentee">Mentees</option>
            <option value="mentor">Mentors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-sm">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Joined</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={isPending ? "opacity-70 transition-opacity" : "transition-opacity"}>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-white/50">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const idString = u._id.toString();
                return (
                  <tr key={idString} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-white/70 text-sm">{u.email}</td>
                    <td className="py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(idString, e.target.value as UserRole)}
                        disabled={isPending}
                        className="text-xs px-2.5 py-1 rounded-full font-medium appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50"
                        style={{
                          background: u.role === 'admin' ? 'rgba(244,63,94,0.1)' : u.role === 'mentor' ? 'rgba(245,158,11,0.1)' : 'rgba(74,222,128,0.1)',
                          color: u.role === 'admin' ? '#fb7185' : u.role === 'mentor' ? '#fbbf24' : '#4ade80',
                          border: `1px solid ${u.role === 'admin' ? 'rgba(244,63,94,0.2)' : u.role === 'mentor' ? 'rgba(245,158,11,0.2)' : 'rgba(74,222,128,0.2)'}`
                        }}
                      >
                        <option value="mentee" className="bg-slate-900 text-white">Mentee</option>
                        <option value="mentor" className="bg-slate-900 text-white">Mentor</option>
                        <option value="admin" className="bg-slate-900 text-white">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 text-white/50 text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDelete(idString, u.name)}
                        disabled={isPending}
                        className="text-white/40 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-50"
                        title="Delete User"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
