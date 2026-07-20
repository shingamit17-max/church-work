"use server";

import dbConnect from "@/lib/db";
import { Testimonial } from "@/models/Testimonial";
import { Event } from "@/models/Event";

export async function getExpandedMentorDetails(userId: string) {
  try {
    await dbConnect();
    
    // Fetch testimonials
    const testimonials = await Testimonial.find({ mentorId: userId })
      .populate("authorId", "name image currentRole company")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
      
    // Fetch upcoming events
    const upcomingEvents = await Event.find({ 
      hostId: userId,
      status: { $in: ["published", "upcoming"] },
      endTime: { $gte: new Date() }
    })
      .sort({ startTime: 1 })
      .limit(3)
      .lean();
      
    return {
      success: true,
      testimonials: JSON.parse(JSON.stringify(testimonials)),
      upcomingEvents: JSON.parse(JSON.stringify(upcomingEvents))
    };
  } catch (error) {
    console.error("Failed to fetch expanded mentor details:", error);
    return {
      success: false,
      testimonials: [],
      upcomingEvents: []
    };
  }
}
