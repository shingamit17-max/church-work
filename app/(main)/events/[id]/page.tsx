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

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                event.isFree ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                {event.isFree ? 'Free Event' : `$${event.price}`}
              </span>
              <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-black/40 text-white/70">
                {event.domain}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
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
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sticky top-24">
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
                  <div className={`font-medium ${isFull ? 'text-red-400' : 'text-teal-400'}`}>
                    {isFull ? 'Full' : `${seatsLeft} spots left`}
                  </div>
                </div>
              </div>

              {!isHost && session?.user?.role === "mentee" && (
                <RegisterButton 
                  eventId={event._id.toString()} 
                  isRegistered={isRegistered} 
                  isFull={isFull} 
                />
              )}
              
              {!isHost && !session?.user && (
                <NextLink href="/login" className="block w-full py-3 bg-white/10 hover:bg-white/20 text-center rounded-xl font-medium transition-colors">
                  Log in to Register
                </NextLink>
              )}

              {isHost && (
                <div className="w-full py-3 bg-indigo-600/20 text-indigo-300 text-center rounded-xl font-medium border border-indigo-500/30">
                  You are hosting this event
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isHost && (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-6">Host Dashboard</h2>
          <div className="flex gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold text-teal-400">{event.registeredCount}</div>
              <div className="text-sm text-white/50">Registered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400">{!event.isFree ? `$${event.registeredCount * event.price}` : 'Free'}</div>
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
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((att: { _id: string, userId: { name: string, email: string }, paymentStatus: string }) => (
                    <tr key={att._id} className="border-b border-white/5">
                      <td className="py-4">{att.userId?.name}</td>
                      <td className="py-4 text-white/70">{att.userId?.email}</td>
                      <td className="py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          att.paymentStatus === 'completed' || att.paymentStatus === 'not_required' 
                            ? 'bg-teal-500/20 text-teal-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
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
