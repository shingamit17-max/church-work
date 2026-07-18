"use client";

import { useState, useTransition } from "react";
import type { User as UserType, UserRole } from "@/types";
import { updateUserRole, deleteUser, createUser } from "@/app/actions/admin";

interface UserManagementTableProps {
  initialUsers: UserType[];
}

export function UserManagementTable({ initialUsers }: UserManagementTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [isPending, startTransition] = useTransition();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "mentee", password: "" });

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

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createUser({ ...formData, role: formData.role as UserRole });
      if (res.error) {
        alert(res.error);
      } else {
        setShowAddModal(false);
        setFormData({ name: "", email: "", role: "mentee", password: "" });
      }
    });
  };

  return (
    <>
    <section className="neobrutal-box p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-foreground">User Management</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 text-sm font-medium transition-colors"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add User
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="warm-input w-full md:w-64 !pl-10"
            />
          </div>
          
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "all" | UserRole)}
            className="warm-input appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="mentee">Mentees</option>
            <option value="mentor">Mentors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto relative">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10" style={{ backgroundColor: "var(--neo-card)" }}>
            <tr style={{ borderBottom: "2px solid var(--neo-border)" }} className="text-muted-foreground text-sm">
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
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const idString = u._id.toString();
                return (
                  <tr key={idString} style={{ borderBottom: "2px solid var(--neo-border)" }} className="hover:bg-foreground/5 transition-colors group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground text-sm">{u.email}</td>
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
                    <td className="py-4 text-muted-foreground text-sm" suppressHydrationWarning>
                      {new Date(u.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="py-4 text-right">
                      {u.email !== "shingamit17@gmail.com" ? (
                        <button
                          onClick={() => handleDelete(idString, u.name)}
                          disabled={isPending}
                          className="text-muted-foreground hover:text-red-500 p-2 rounded-none border-2 border-transparent hover:border-red-500 transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-muted-foreground text-xs px-2" title="Super Admin cannot be deleted">Protected</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>

    {/* Add User Modal */}
    {showAddModal && (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="p-6 max-w-md w-full neobrutal-box animate-in fade-in zoom-in duration-200">
          <h3 className="text-xl font-bold text-foreground mb-2">Add New User</h3>
          <p className="text-muted-foreground mb-6 text-sm">Manually create a new user account.</p>
          
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-1">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="warm-input" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1">Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="warm-input" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1">Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="warm-input appearance-none">
                <option value="mentee" className="bg-slate-900">Mentee</option>
                <option value="mentor" className="bg-slate-900">Mentor</option>
                <option value="admin" className="bg-slate-900">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1">Temporary Password</label>
              <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="warm-input" placeholder="••••••••" />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="flex-1 btn-amber">
                {isPending ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}
