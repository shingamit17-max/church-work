import { Inngest } from "inngest";
import dbConnect from "./db";
import { Match } from "@/models/Match";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "grace-mentor" });

// 1. mentorFeedbackNudge: 7 days after match active with no feedback
export const mentorFeedbackNudge = inngest.createFunction(
  { id: "mentor-feedback-nudge" },
  { event: "match/accepted" },
  async ({ event, step }) => {
    // Wait for 7 days
    await step.sleep("wait-7-days", "7d");
    
    // Check if feedback exists
    await step.run("check-feedback-and-notify", async () => {
      await dbConnect();
      const { MentorFeedback } = await import("@/models/MentorFeedback");
      
      const hasFeedback = await MentorFeedback.exists({ matchId: event.data.matchId });
      if (!hasFeedback) {
        // In a real app, send an email using Resend here.
        // For MVP, we just log it as a notification.
        console.log(`[Inngest] Nudging mentor ${event.data.mentorId} to leave feedback for match ${event.data.matchId}`);
      }
    });
  }
);

// 2. testimonialPrompt: match marked completed
export const testimonialPrompt = inngest.createFunction(
  { id: "testimonial-prompt" },
  { event: "match/completed" },
  async ({ event, step }) => {
    // Wait 1 day after completion to ask for testimonial
    await step.sleep("wait-1-day", "1d");
    
    await step.run("send-testimonial-email", async () => {
      // In a real app, send an email to the mentee asking for a testimonial
      console.log(`[Inngest] Asking mentee ${event.data.menteeId} for a testimonial`);
    });
  }
);

// 3. shareCardGeneration: mentor profile updated
export const shareCardGeneration = inngest.createFunction(
  { id: "share-card-generation" },
  { event: "mentor/profile-updated" },
  async ({ event, step }) => {
    await step.run("generate-og-image", async () => {
      // Logic to ping the @vercel/og endpoint or trigger a revalidation
      console.log(`[Inngest] Re-generating OG share card for mentor ${event.data.mentorId}`);
    });
  }
);

// 4. matchScoreRefresh: new mentor feedback submitted
export const matchScoreRefresh = inngest.createFunction(
  { id: "match-score-refresh" },
  { event: "feedback/submitted" },
  async ({ event, step }) => {
    await step.run("refresh-match-scores", async () => {
      await dbConnect();
      // Logic to re-calculate matching score for the mentee based on new feedback
      console.log(`[Inngest] Refreshing match scores for mentee ${event.data.menteeId} based on new feedback`);
    });
  }
);
