"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MatchStatus } from "@/types";

interface InboxItem {
  matchId: string;
  status: MatchStatus;
  otherUser: {
    id: string;
    name: string;
    image?: string;
    role: string;
  };
  latestMessage: {
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return date.toLocaleDateString();
}

export default function MessagesInboxPage() {
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chat/inbox")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInbox(data.inbox);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-1/3"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground" style={{ letterSpacing: "-0.03em" }}>
          Messages
        </h1>
        <p className="text-sm mt-1 text-muted-foreground font-medium">
          Your 1:1 mentorship conversations.
        </p>
      </div>

      {inbox.length === 0 ? (
        <div className="p-12 rounded-2xl text-center flex flex-col items-center justify-center border-2 border-dashed border-border/50 bg-black/5 dark:bg-white/5">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500 text-2xl">
            💬
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No active conversations</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Once a mentor accepts your request (or a mentee requests you), you'll be able to chat here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inbox.map(item => (
            <Link 
              key={item.matchId} 
              href={`/messages/${item.matchId}`}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent hover:border-neo-border bg-card shadow-sm transition-all hover:-translate-y-0.5"
            >
              <div className="relative shrink-0">
                {item.otherUser.image ? (
                  <Image 
                    src={item.otherUser.image} 
                    alt={item.otherUser.name} 
                    width={56} 
                    height={56} 
                    className="rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff" }}>
                    {item.otherUser.name.charAt(0)}
                  </div>
                )}
                {item.status === 'completed' && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-500 border-2 border-background flex items-center justify-center text-[10px]" title="Completed">
                    ✓
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold truncate text-foreground ${item.unreadCount > 0 ? "text-base" : "text-base"}`}>
                    {item.otherUser.name}
                  </h3>
                  {item.latestMessage && (
                    <span className={`text-xs whitespace-nowrap ml-2 ${item.unreadCount > 0 ? "font-bold text-amber-500" : "text-muted-foreground"}`}>
                      {formatRelativeTime(item.latestMessage.createdAt)}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center gap-4">
                  <p className={`text-sm truncate ${item.unreadCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                    {item.status === 'completed' && <span className="mr-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-gray-500/20 text-gray-400">Completed</span>}
                    {item.latestMessage ? item.latestMessage.content : "Start the conversation!"}
                  </p>
                  
                  {item.unreadCount > 0 && (
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-black shrink-0">
                      {item.unreadCount > 9 ? "9+" : item.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
