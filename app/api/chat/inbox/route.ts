import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";
import { Message } from "@/models/Message";
import { User } from "@/models/User";
import { MatchStatus } from "@/types";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const userId = session.user.id;

    // Find all matches for this user that are accepted, active, or completed
    const matches = await Match.find({
      $or: [{ menteeId: userId }, { mentorId: userId }],
      status: { $in: [MatchStatus.ACCEPTED, MatchStatus.ACTIVE, MatchStatus.COMPLETED] }
    }).populate('menteeId', 'name image role churchOrganization').populate('mentorId', 'name image role churchOrganization');

    // For each match, fetch the latest message and unread count
    const inboxItems = await Promise.all(matches.map(async (match) => {
      const isMentor = match.mentorId._id.toString() === userId;
      const otherUser = isMentor ? match.menteeId : match.mentorId;
      
      const latestMessage = await Message.findOne({ matchId: match._id })
        .sort({ createdAt: -1 })
        .limit(1);

      const unreadCount = await Message.countDocuments({
        matchId: match._id,
        senderId: { $ne: userId },
        readBy: { $ne: userId }
      });

      return {
        matchId: match._id,
        status: match.status,
        otherUser: {
          id: otherUser._id,
          name: otherUser.name,
          image: otherUser.image,
          role: otherUser.role,
        },
        latestMessage: latestMessage ? {
          content: latestMessage.type === 'resource' ? 'Sent a resource' : latestMessage.content,
          createdAt: latestMessage.createdAt,
          senderId: latestMessage.senderId
        } : null,
        unreadCount,
        sortTime: latestMessage ? latestMessage.createdAt : match.createdAt
      };
    }));

    // Sort by latest message time, or match creation time if no messages
    inboxItems.sort((a, b) => new Date(b.sortTime).getTime() - new Date(a.sortTime).getTime());

    return NextResponse.json({ success: true, inbox: inboxItems });
  } catch (error) {
    console.error("Fetch inbox error:", error);
    return NextResponse.json({ error: "Failed to fetch inbox" }, { status: 500 });
  }
}
