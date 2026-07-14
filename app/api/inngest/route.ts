import { serve } from "inngest/next";
import { 
  inngest, 
  mentorFeedbackNudge, 
  testimonialPrompt, 
  shareCardGeneration, 
  matchScoreRefresh 
} from "@/lib/inngest";

// Create an API that serves zero-dependency functions on edge or serverless
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    mentorFeedbackNudge,
    testimonialPrompt,
    shareCardGeneration,
    matchScoreRefresh,
  ],
});
