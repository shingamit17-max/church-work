"use client";

import { useEffect, useState, useRef } from "react";
import { getPusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { use } from "react";
import BackButton from "@/components/BackButton";

export default function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const resolvedParams = use(params);
  const { matchId } = resolvedParams;
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
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
    
    channel.bind("new-message", (newMsg: any) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === newMsg.id || m._id === newMsg.id)) return prev;
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
      <div className="flex flex-col h-[calc(100vh-12rem)] bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <h2 className="font-semibold text-lg">Mentorship Chat</h2>
        <p className="text-xs text-white/50">Match ID: {matchId}</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === session?.user?.id;
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-xl ${isMe ? 'bg-indigo-600 rounded-br-sm' : 'bg-white/10 rounded-bl-sm'}`}>
                <p className="text-sm">{msg.content}</p>
                <span className="text-[10px] text-white/50 mt-1 block">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
