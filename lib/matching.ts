import { MenteeProfile, MentorProfile } from "@/types";

export interface MatchResult {
  mentorId: string;
  score: number;
  reason: string;
}

export function calculateMatchScore(mentee: MenteeProfile, mentor: MentorProfile): MatchResult {
  let score = 0;
  let reason = "";

  // 1. Domain/industry alignment (40%)
  const menteeDomain = mentee.targetDomain.toLowerCase();
  const mentorDomain = mentor.domain.toLowerCase();
  const mentorSpec = mentor.specialization.toLowerCase();
  
  let domainScore = 0;
  if (mentorDomain.includes(menteeDomain) || menteeDomain.includes(mentorDomain)) {
    domainScore = 40;
    reason = `Strong alignment in ${mentor.domain}`;
  } else if (mentorSpec.includes(menteeDomain) || menteeDomain.includes(mentorSpec)) {
    domainScore = 30; // Partial match on specialization
    reason = `Specializes in your target area: ${mentor.specialization}`;
  }
  score += domainScore;

  // 2. Pain-point overlap (30%)
  const menteePainPoints = mentee.diagnosticAnswers?.painPoints || [];
  const mentorHelpsWith = mentor.painPointsCanHelp || [];
  
  let painPointScore = 0;
  if (menteePainPoints.length > 0) {
    const overlap = menteePainPoints.filter(p => mentorHelpsWith.includes(p));
    painPointScore = (overlap.length / menteePainPoints.length) * 30;
    score += painPointScore;
    
    if (painPointScore > 15 && !reason) {
      reason = `Can help with your primary gap: ${overlap[0].replace('_', ' ')}`;
    } else if (overlap.length > 0) {
      reason += reason ? ` and ${overlap[0].replace('_', ' ')}` : `Can help with ${overlap[0].replace('_', ' ')}`;
    }
  }

  // 3. Seniority fit (15%)
  let seniorityScore = 0;
  if (mentor.menteeSeniority?.includes(mentee.careerStage)) {
    seniorityScore = 15;
    score += seniorityScore;
  }

  // 4. Availability overlap (10%)
  let availabilityScore = 0;
  // Simple heuristic: If mentor has slots left, they are available.
  if (mentor.currentMenteeCount < mentor.maxMentees) {
    availabilityScore = 10;
    score += availabilityScore;
  }

  // 5. Mode preference match (5%)
  let modeScore = 0;
  if (mentee.availability?.preferredMode === mentor.availability?.preferredMode) {
    modeScore = 5;
    score += modeScore;
  }

  // Fallback reason if none matched strongly
  if (!reason) {
    if (score > 50) reason = "Good overall profile fit";
    else reason = "Available to mentor";
  }

  return {
    mentorId: mentor.userId.toString(),
    score: Math.round(score),
    reason,
  };
}

export function rankMentors(mentee: MenteeProfile, mentors: MentorProfile[], topK: number = 4): MatchResult[] {
  // Filter out mentors who are at capacity
  const availableMentors = mentors.filter(m => m.currentMenteeCount < m.maxMentees);
  
  const scoredMentors = availableMentors.map(mentor => calculateMatchScore(mentee, mentor));
  
  // Sort descending by score
  scoredMentors.sort((a, b) => b.score - a.score);
  
  return scoredMentors.slice(0, topK);
}
