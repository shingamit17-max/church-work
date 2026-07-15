import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { Match } from "@/models/Match";
import { Event } from "@/models/Event";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await dbConnect();

  const totalUsers = await User.countDocuments();
  const totalMentors = await User.countDocuments({ role: 'mentor' });
  const totalMentees = await User.countDocuments({ role: 'mentee' });
  const totalMatches = await Match.countDocuments();
  const totalEvents = await Event.countDocuments();

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).lean();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-red-400 to-orange-400">
          Admin Dashboard
        </h1>
        <p className="text-white/60">Platform Overview & Management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-white/50 mb-2">Total Users</div>
          <div className="text-3xl font-bold">{totalUsers}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-white/50 mb-2">Mentors / Mentees</div>
          <div className="text-xl font-bold">{totalMentors} / {totalMentees}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-white/50 mb-2">Total Matches</div>
          <div className="text-3xl font-bold">{totalMatches}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-white/50 mb-2">Hosted Events</div>
          <div className="text-3xl font-bold">{totalEvents}</div>
        </div>
      </div>

      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <h2 className="text-xl font-bold mb-6">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-sm">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u: any) => (
                <tr key={u._id.toString()} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4">{u.name}</td>
                  <td className="py-4 text-white/70">{u.email}</td>
                  <td className="py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      u.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                      u.role === 'mentor' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-teal-500/20 text-teal-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 text-white/50">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
