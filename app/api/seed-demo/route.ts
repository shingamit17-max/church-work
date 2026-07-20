import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { MentorProfile } from "@/models/MentorProfile";
import { Testimonial } from "@/models/Testimonial";
import { Event } from "@/models/Event";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    
    // Clean up previous runs
    const existingMentor = await User.findOne({ email: "sarah.demo@example.com" });
    if (existingMentor) {
      await MentorProfile.deleteOne({ userId: existingMentor._id });
      await Testimonial.deleteMany({ mentorId: existingMentor._id });
      await Event.deleteMany({ hostId: existingMentor._id });
      await User.deleteOne({ _id: existingMentor._id });
    }
    
    await User.deleteMany({ email: { $in: ["david.demo@example.com", "maria.demo@example.com"] } });

    // 1. Create a dummy user for the mentor
    const mentorUser = await User.create({
      name: "Sarah Jenkins",
      email: "sarah.demo@example.com",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      role: "mentor",
      onboardingComplete: true,
      verified: true,
      churchOrganization: "Grace Hills Church",
      password: "dummy-password",
    });

    // 2. Create the Mentor Profile
    const mentorProfile = await MentorProfile.create({
      userId: mentorUser._id,
      company: "Google",
      currentRole: "Senior Software Engineer",
      yearsExp: 8,
      domain: "Engineering",
      specialization: "Frontend & Architecture",
      helpTypes: ["1:1", "resume", "mock", "guidance"],
      painPointsCanHelp: ["career direction", "technical skills", "interview confidence"],
      menteeSeniority: ["fresher", "1-3 yrs", "career switcher"],
      availability: {
        hoursPerMonth: 10,
        preferredMode: "calls",
      },
      maxMentees: 5,
      currentMenteeCount: 2,
      bio: "Hi! I'm Sarah, a Senior SWE at Google with 8 years of experience building scalable web applications. I love helping folks transition into tech from non-traditional backgrounds, just like I did! When I'm not coding, I'm volunteering at my local church's youth ministry or hiking with my dog.\n\nI specialize in React, Next.js, and frontend architecture. Whether you need a resume review, mock interviews, or just a sounding board for your career, I'd love to help.",
      shareSlug: "sarah-jenkins-demo",
      impactStats: {
        menteesHelped: 14,
        workshopsHosted: 3,
        testimonialsReceived: 2,
      },
    });

    // 3. Create a dummy user for the testimonials
    const menteeUser1 = await User.create({
      name: "David Chen",
      email: "david.demo@example.com",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      role: "mentee",
      currentRole: "Junior Developer",
      password: "dummy-password",
    });

    const menteeUser2 = await User.create({
      name: "Maria Garcia",
      email: "maria.demo@example.com",
      role: "mentee",
      currentRole: "CS Student",
      password: "dummy-password",
    });

    // 4. Create Testimonials
    await Testimonial.create({
      authorId: menteeUser1._id,
      mentorId: mentorUser._id,
      painPoints: ["technical skills"],
      whatHelped: "Mock Interviews",
      outcome: "Got a job offer!",
      freeText: "Sarah is incredible! Her mock interviews were tough but exactly what I needed. She helped me identify gaps in my React knowledge and gave me a clear study plan. I just landed my first Junior SWE role thanks to her guidance!",
    });

    await Testimonial.create({
      authorId: menteeUser2._id,
      mentorId: mentorUser._id,
      painPoints: ["career direction"],
      whatHelped: "Resume Review",
      outcome: "More interview callbacks",
      freeText: "I was struggling to get callbacks with my non-traditional background. Sarah completely revamped how I present my skills. She's so patient and genuinely cares about your success.",
    });

    // 5. Create Upcoming Events
    await Event.create({
      hostId: mentorUser._id,
      title: "Frontend System Design Interview Prep",
      description: "A deep dive into how to tackle frontend system design interviews at big tech companies.",
      painPointTags: ["system design"],
      domain: "Engineering",
      isFree: true,
      status: "upcoming",
      dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      capacity: 20,
      registeredCount: 5,
    });

    await Event.create({
      hostId: mentorUser._id,
      title: "Ask Me Anything: Breaking into Big Tech",
      description: "Open Q&A session.",
      painPointTags: ["career direction"],
      domain: "Engineering",
      isFree: true,
      status: "upcoming",
      dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      capacity: 50,
      registeredCount: 12,
    });

    return NextResponse.json({ success: true, message: "Demo mentor created!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}
