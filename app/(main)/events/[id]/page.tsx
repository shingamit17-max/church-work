import { notFound } from "next/navigation";
import NextLink from "next/link";
import dbConnect from "@/lib/db";
import { Event } from "@/models/Event";
import { auth } from "@/lib/auth";
import { EventRegistration } from "@/models/EventRegistration";
import RegisterButton from "./RegisterButton";
import BackButton from "@/components/BackButton";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const session = await auth();

  await dbConnect();

  const event = await Event.findById(id).populate("hostId", "name image");
  if (!event) notFound();

  let isRegistered = false;
  if (session?.user) {
    const registration = await EventRegistration.findOne({ eventId: id, userId: session.user.id });
    if (registration) isRegistered = true;
  }

  const isHost = session?.user?.id === event.hostId._id.toString();
  const seatsLeft = event.capacity - event.registeredCount;
  const isFull = seatsLeft <= 0;

  // If host, get attendees
  let attendees = [];
  if (isHost) {
    attendees = await EventRegistration.find({ eventId: id }).populate("userId", "name email");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <BackButton fallbackUrl="/events" />

      <div 
        className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
        style={{
          background: "rgba(41,37,36,0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)"
        }}
      >
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none rounded-full" 
          style={{ 
            background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
            transform: "translate(30%,-30%)"
          }} 
        />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span 
                className="text-xs px-3 py-1 rounded-full border font-semibold"
                style={{
                  background: event.isFree ? "rgba(74,222,128,0.1)" : "rgba(245,158,11,0.1)",
                  color: event.isFree ? "#4ade80" : "#fbbf24",
                  border: `1px solid ${event.isFree ? "rgba(74,222,128,0.2)" : "rgba(245,158,11,0.2)"}`
                }}
              >
                {event.isFree ? 'Free Event' : `$${event.price}`}
              </span>
              <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-black/40 text-white/70">
                {event.domain}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
            
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                style={{ background: "linear-gradient(135deg,#ef4444,#eab308)", color: "#eab308" }}
              >
                {event.hostId?.name?.charAt(0) || '?'}
              </div>
              <div>
                <div className="text-sm text-white/50">Hosted by</div>
                <div className="font-medium">{event.hostId?.name}</div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-8 text-white/80">
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-white/50 uppercase tracking-wider">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {event.painPointTags.map((pt: string) => (
                  <span key={pt} className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white/80">
                    {pt.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 shrink-0">
            <div 
              className="rounded-2xl p-6 sticky top-24"
              style={{ background: "rgba(28,25,23,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs text-white/50 mb-1">Date & Time</div>
                  <div className="font-medium text-lg">
                    {new Date(event.dateTime).toLocaleString(undefined, { 
                      weekday: 'short', month: 'short', day: 'numeric', 
                      hour: 'numeric', minute: '2-digit' 
                    })}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div className="text-xs text-white/50">Capacity</div>
                  <div className="font-medium">{event.capacity} total spots</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-white/50">Availability</div>
                  <div className="font-medium" style={{ color: isFull ? "#fb7185" : "#4ade80" }}>
                    {isFull ? 'Full' : `${seatsLeft} spots left`}
                  </div>
                </div>
              </div>

              {!isHost && session?.user?.role === "mentee" && (
                <RegisterButton 
                  eventId={event._id.toString()} 
                  isRegistered={isRegistered} 
                  isFull={isFull}
                  customQuestions={event.customQuestions || []}
                />
              )}
              
              {!isHost && !session?.user && (
                <NextLink href="/login" className="block w-full py-3 bg-white/10 hover:bg-white/20 text-center rounded-xl font-medium transition-colors">
                  Log in to Register
                </NextLink>
              )}

              {isHost && (
                <div 
                  className="w-full py-3 text-center rounded-xl font-medium"
                  style={{ background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" }}
                >
                  You are hosting this event
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isHost && (
        <div 
          className="rounded-3xl p-8 md:p-12"
          style={{ background: "rgba(41,37,36,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-2xl font-bold mb-6">Host Dashboard</h2>
          <div className="flex gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold" style={{ color: "#4ade80" }}>{event.registeredCount}</div>
              <div className="text-sm text-white/50">Registered</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: "#fbbf24" }}>{!event.isFree ? `$${event.registeredCount * event.price}` : 'Free'}</div>
              <div className="text-sm text-white/50">Revenue</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Attendee List</h3>
          {attendees.length === 0 ? (
            <p className="text-white/50">No one has registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-sm">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    {event.customQuestions?.length > 0 && <th className="pb-3 font-medium">Responses</th>}
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((att: { _id: string, userId: { name: string, email: string }, paymentStatus: string, customAnswers?: { question: string, answer: string }[] }) => (
                    <tr key={att._id} className="border-b border-white/5">
                      <td className="py-4">{att.userId?.name}</td>
                      <td className="py-4 text-white/70">{att.userId?.email}</td>
                      {event.customQuestions?.length > 0 && (
                        <td className="py-4 text-xs text-white/60 max-w-xs">
                          {att.customAnswers?.length ? att.customAnswers.map((ans, i) => (
                            <div key={i} className="mb-1.5 line-clamp-2" title={`${ans.question}\n${ans.answer}`}>
                              <span className="font-medium text-white/80 block truncate">{ans.question}</span>
                              <span className="text-white/60">{ans.answer}</span>
                            </div>
                          )) : <span className="italic">No responses</span>}
                        </td>
                      )}
                      <td className="py-4">
                        <span 
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: (att.paymentStatus === 'completed' || att.paymentStatus === 'not_required') ? 'rgba(74,222,128,0.1)' : 'rgba(245,158,11,0.1)',
                            color: (att.paymentStatus === 'completed' || att.paymentStatus === 'not_required') ? '#4ade80' : '#fbbf24',
                            border: `1px solid ${(att.paymentStatus === 'completed' || att.paymentStatus === 'not_required') ? 'rgba(74,222,128,0.2)' : 'rgba(245,158,11,0.2)'}`
                          }}
                        >
                          {att.paymentStatus.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
