import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { Match } from "@/models/Match";
import { Event } from "@/models/Event";
import { MenteeProfile } from "@/models/MenteeProfile";
import { MentorProfile } from "@/models/MentorProfile";
import { redirect } from "next/navigation";
import type { User as UserType, AdminUserView } from "@/types";
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
  const mentees = await MenteeProfile.find().lean();
  const mentors = await MentorProfile.find().lean();

  const menteeMap = new Map(mentees.map(m => [m.userId.toString(), m]));
  const mentorMap = new Map(mentors.map(m => [m.userId.toString(), m]));

  // Convert MongoDB ObjectIds to strings and merge profiles
  const serializedUsers: AdminUserView[] = allUsers.map(user => {
    const id = user._id.toString();
    const profile = (menteeMap.get(id) || mentorMap.get(id) || {}) as any;
    
    return {
      ...user,
      _id: id,
      phoneNumber: profile.phoneNumber,
      currentRole: profile.currentRole,
      company: profile.company,
      careerStage: profile.careerStage || profile.menteeSeniority, // mentorProfile might not have careerStage, but we'll capture what we can
      bio: profile.bio,
    };
  });

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
        <h1 className="text-4xl font-black mb-2 text-amber-500 tracking-tight [text-shadow:2px_2px_0px_#111] dark:[text-shadow:none]">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Platform Overview & Management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 neobrutal-box">
          <div className="text-sm text-muted-foreground mb-2">Total Users</div>
          <div className="text-3xl font-bold text-foreground">{totalUsers}</div>
        </div>
        <div className="p-6 neobrutal-box">
          <div className="text-sm text-muted-foreground mb-2">Mentors / Mentees</div>
          <div className="text-xl font-bold text-foreground">{totalMentors} / {totalMentees}</div>
        </div>
        <div className="p-6 neobrutal-box">
          <div className="text-sm text-muted-foreground mb-2">Total Matches</div>
          <div className="text-3xl font-bold text-foreground">{totalMatches}</div>
        </div>
        <div className="p-6 neobrutal-box">
          <div className="text-sm text-muted-foreground mb-2">Hosted Events</div>
          <div className="text-3xl font-bold text-foreground">{totalEvents}</div>
        </div>
      </div>

      <AdminRequestsList initialRequests={serializedRequests} />

      <UserManagementTable initialUsers={serializedUsers} />
    </div>
  );
}
