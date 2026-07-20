import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";
import { Message } from "@/models/Message";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import ChatThread from "./ChatThread";

export default async function MessageThreadPage({ params }: { params: Promise<{ matchId: string }> }) {
  const resolvedParams = await params;
  const { matchId } = resolvedParams;
  
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await dbConnect();

  const match = await Match.findById(matchId)
    .populate('menteeId', 'name image role churchOrganization')
    .populate('mentorId', 'name image role churchOrganization')
    .lean() as any;

  if (!match) {
    redirect("/messages");
  }

  const userId = session.user.id;
  const isMentee = match.menteeId._id.toString() === userId;
  const isMentor = match.mentorId._id.toString() === userId;

  if (!isMentee && !isMentor) {
    redirect("/messages");
  }

  if (match.status === 'pending' || match.status === 'declined') {
    redirect("/messages");
  }

  const otherUser = isMentor ? match.menteeId : match.mentorId;
  const initialMessages = await Message.find({ matchId }).sort({ createdAt: 1 }).lean();

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] lg:h-[calc(100vh-10rem)]">
      <ChatThread 
        matchId={matchId} 
        matchStatus={match.status}
        otherUser={{
          id: otherUser._id.toString(),
          name: otherUser.name,
          image: otherUser.image,
          role: otherUser.role
        }}
        initialMessages={JSON.parse(JSON.stringify(initialMessages))}
        currentUserId={userId}
      />
    </div>
  );
}
