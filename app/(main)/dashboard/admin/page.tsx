import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { Match } from "@/models/Match";
import { Event } from "@/models/Event";
import { redirect } from "next/navigation";
import type { User as UserType } from "@/types";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { AdminRequest } from "@/models/AdminRequest";
import { AdminRequestsList } from "@/components/admin/AdminRequestsList";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await dbConnect();

  const totalUsers = await User.countDocuments();
  const totalMentors = await User.countDocuments({ role: 'mentor' });
  const totalMentees = await User.countDocuments({ role: 'mentee' });
  const totalMatches = await Match.countDocuments();
  const totalEvents = await Event.countDocuments();

  const allUsers = await User.find().sort({ createdAt: -1 }).lean() as unknown as UserType[];

  // Convert MongoDB ObjectIds to strings to avoid serialization issues in Client Components
  const serializedUsers = allUsers.map(user => ({
    ...user,
    _id: user._id.toString(),
  }));

  const pendingRequests = await AdminRequest.find({ status: "PENDING" })
    .populate("user", "name email role")
    .sort({ createdAt: -1 })
    .lean();
    
  const serializedRequests = pendingRequests.map(req => ({
    ...req,
    _id: (req as any)._id.toString(),
    user: req.user ? { ...(req as any).user, _id: (req as any).user._id.toString() } : null
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-rose-400">
          Admin Dashboard
        </h1>
        <p className="text-white/60">Platform Overview & Management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="rounded-2xl p-6" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-sm text-white/50 mb-2">Total Users</div>
          <div className="text-3xl font-bold">{totalUsers}</div>
        </div>
        <div className="rounded-2xl p-6" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-sm text-white/50 mb-2">Mentors / Mentees</div>
          <div className="text-xl font-bold">{totalMentors} / {totalMentees}</div>
        </div>
        <div className="rounded-2xl p-6" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-sm text-white/50 mb-2">Total Matches</div>
          <div className="text-3xl font-bold">{totalMatches}</div>
        </div>
        <div className="rounded-2xl p-6" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-sm text-white/50 mb-2">Hosted Events</div>
          <div className="text-3xl font-bold">{totalEvents}</div>
        </div>
      </div>

      <AdminRequestsList initialRequests={serializedRequests} />

      <UserManagementTable initialUsers={serializedUsers} />
    </div>
  );
}
