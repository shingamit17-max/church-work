"use client";

import { useEffect, useState, useRef } from "react";
import { getPusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { use } from "react";
import type { Message } from "@/types";
import BackButton from "@/components/BackButton";

export default function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const resolvedParams = use(params);
  const { matchId } = resolvedParams;
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial messages
    fetch(`/api/chat/messages?matchId=${matchId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(data.messages);
          bottomRef.current?.scrollIntoView();
        }
      });

    // Sub to Pusher
    const pusher = getPusherClient();
    const channel = pusher.subscribe(matchId);
    
    channel.bind("new-message", (newMsg: Message) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => {
      pusher.unsubscribe(matchId);
    };
  }, [matchId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const content = input;
    setInput("");

    // Optimistic UI could go here
    
    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, content })
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton fallbackUrl="/dashboard" />
      <div className="flex flex-col h-[calc(100vh-12rem)] rounded-2xl overflow-hidden relative" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Ambient background orbs */}
      <div className="absolute pointer-events-none w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)", top: "-10%", left: "-10%" }} />
      
      <div className="p-4 relative z-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <h2 className="font-semibold text-lg" style={{ color: "#fafaf9", letterSpacing: "-0.02em" }}>Mentorship Chat</h2>
        <p className="text-xs" style={{ color: "#57534e" }}>Match ID: {matchId}</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 relative z-10">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === session?.user?.id;
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] p-3 rounded-2xl ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                style={{
                  background: isMe ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isMe ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.08)"}`,
                  color: isMe ? "#fbbf24" : "#fafaf9"
                }}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span className="text-[10px] mt-1.5 block opacity-60">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-xl px-4 py-2.5 focus:outline-none transition-all text-sm"
            style={{ 
              background: "rgba(28,25,23,0.8)", 
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fafaf9"
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="px-6 py-2.5 disabled:opacity-50 font-semibold rounded-xl transition-all text-sm flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#f59e0b,#d97706)",
              color: "#0c0a09",
              boxShadow: "0 4px 12px rgba(245,158,11,0.2)"
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
