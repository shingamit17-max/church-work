"use client";

import { useEffect, useState, useRef } from "react";
import { getPusherClient } from "@/lib/pusher";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Paperclip, Send, CheckCircle, ExternalLink, X } from "lucide-react";
import { MatchStatus } from "@/types";

interface Message {
  _id: string;
  matchId: string;
  senderId: string;
  content: string;
  type: 'text' | 'resource';
  attachments?: string[];
  createdAt: string;
}

interface ChatThreadProps {
  matchId: string;
  matchStatus: string;
  currentUserId: string;
  otherUser: {
    id: string;
    name: string;
    image?: string;
    role: string;
  };
  initialMessages: Message[];
}

export default function ChatThread({ matchId, matchStatus: initialStatus, currentUserId, otherUser, initialMessages }: ChatThreadProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  
  // Resource Form
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceTags, setResourceTags] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read
    fetch("/api/chat/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId })
    });

    const pusher = getPusherClient();
    const channel = pusher.subscribe(matchId);
    
    channel.bind("new-message", (newMsg: Message) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
      // Also mark this new message as read if we are focused
      fetch("/api/chat/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId })
      });
    });

    channel.bind("match-completed", () => {
      setStatus(MatchStatus.COMPLETED);
    });

    return () => {
      pusher.unsubscribe(matchId);
    };
  }, [matchId]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || status === MatchStatus.COMPLETED) return;

    const content = input;
    setInput("");

    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, content })
    });
  };

  const sendResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim() || !resourceUrl.trim() || status === MatchStatus.COMPLETED) return;

    setShowResourceModal(false);
    
    const tags = resourceTags.split(",").map(t => t.trim()).filter(Boolean);
    
    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        matchId, 
        content: `Shared a resource: ${resourceTitle}`,
        type: 'resource',
        resourceData: {
          title: resourceTitle,
          url: resourceUrl,
          painPointTags: tags
        }
      })
    });

    setResourceTitle("");
    setResourceUrl("");
    setResourceTags("");
  };

  const markCompleted = async () => {
    if (!confirm("Are you sure you want to mark this mentorship as completed? Both parties will retain access to the chat history, but no new messages can be sent.")) return;
    
    setIsMarkingCompleted(true);
    const res = await fetch(`/api/matches/${matchId}/complete`, { method: "POST" });
    if (res.ok) {
      setStatus(MatchStatus.COMPLETED);
    }
    setIsMarkingCompleted(false);
  };

  const groupMessagesByDate = () => {
    const groups: { [date: string]: Message[] } = {};
    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-card border-2 border-border shadow-[4px_4px_0px_var(--neo-border)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-border bg-black/5 dark:bg-white/5">
        <Link href={`/dashboard/${otherUser.role === 'mentor' ? 'mentee' : 'mentor'}/profile/${otherUser.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {otherUser.image ? (
            <Image src={otherUser.image} alt={otherUser.name} width={40} height={40} className="rounded-full border border-border" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center">
              {otherUser.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="font-bold text-foreground leading-tight">{otherUser.name}</h2>
            <p className="text-xs font-medium text-muted-foreground capitalize">{otherUser.role}</p>
          </div>
        </Link>
        
        {status !== MatchStatus.COMPLETED && (
          <button 
            onClick={markCompleted}
            disabled={isMarkingCompleted}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-border bg-background hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mark Completed</span>
          </button>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-muted-foreground">
                {date === new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) ? "Today" : date}
              </span>
            </div>
            {msgs.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              
              if (msg.type === 'resource') {
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-xl border-2 ${
                      isMe 
                        ? 'border-amber-500/50 bg-amber-500/10 rounded-br-sm' 
                        : 'border-border bg-background rounded-bl-sm'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isMe ? 'bg-amber-500 text-black' : 'bg-black/10 dark:bg-white/10 text-foreground'}`}>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-1">
                            {isMe ? 'You shared a resource' : `${otherUser.name} shared a resource`}
                          </p>
                          <a href={msg.content.replace('Shared a resource: ', '') /* We should ideally store URL separate, but content has title */} 
                             target="_blank" rel="noreferrer"
                             className={`font-bold hover:underline ${isMe ? 'text-amber-500' : 'text-foreground'}`}>
                            {msg.content.replace('Shared a resource: ', '')}
                          </a>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase mt-2 block opacity-60 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl border-2 ${
                    isMe 
                      ? 'border-transparent bg-amber-500 text-black rounded-br-sm' 
                      : 'border-border bg-background text-foreground rounded-bl-sm'
                  }`}>
                    <p className="text-sm font-medium whitespace-pre-wrap break-words">{msg.content}</p>
                    <span className="text-[9px] font-bold uppercase mt-1 block opacity-60 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      {status === MatchStatus.COMPLETED ? (
        <div className="p-4 border-t-2 border-border bg-black/5 dark:bg-white/5 text-center">
          <p className="text-sm font-bold text-muted-foreground">
            This mentorship has been marked complete.
          </p>
        </div>
      ) : (
        <div className="p-4 border-t-2 border-border bg-background relative">
          <form onSubmit={sendMessage} className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setShowResourceModal(true)}
              className="w-11 h-11 shrink-0 rounded-xl border-2 border-border flex items-center justify-center text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-xl px-4 py-2 border-2 border-border focus:outline-none focus:border-amber-500 transition-colors bg-transparent text-sm font-medium"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="w-11 h-11 shrink-0 rounded-xl bg-amber-500 text-black flex items-center justify-center disabled:opacity-50 transition-opacity border-2 border-transparent hover:border-black/20"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      )}

      {/* Resource Modal */}
      {showResourceModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl border-2 border-border shadow-[8px_8px_0px_var(--neo-border)] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-border">
              <h3 className="font-bold text-foreground">Share Resource</h3>
              <button onClick={() => setShowResourceModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={sendResource} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Title</label>
                <input required type="text" value={resourceTitle} onChange={e => setResourceTitle(e.target.value)} className="w-full rounded-xl px-3 py-2 border-2 border-border bg-transparent focus:outline-none focus:border-amber-500 text-sm font-medium" placeholder="e.g. System Design Primer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">URL</label>
                <input required type="url" value={resourceUrl} onChange={e => setResourceUrl(e.target.value)} className="w-full rounded-xl px-3 py-2 border-2 border-border bg-transparent focus:outline-none focus:border-amber-500 text-sm font-medium" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Tags (comma separated)</label>
                <input type="text" value={resourceTags} onChange={e => setResourceTags(e.target.value)} className="w-full rounded-xl px-3 py-2 border-2 border-border bg-transparent focus:outline-none focus:border-amber-500 text-sm font-medium" placeholder="technical skills, system design" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-bold border-2 border-transparent hover:border-black/20 transition-all">
                Share Resource
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
