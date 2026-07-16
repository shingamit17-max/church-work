import { calculateMatchScore, rankMentors } from "./matching";
import { CareerStage, DiagnosticFunnelStage, PainPoint } from "@/types";

describe("Matching Algorithm", () => {
  const mentee = {
    userId: "mentee1",
    status: "unemployed" as const,
    careerStage: CareerStage.FRESHER,
    targetDomain: "Frontend",
    targetRoles: ["React Developer"],
    diagnosticAnswers: {
      funnelStage: DiagnosticFunnelStage.NO_CALLS,
      painPoints: [PainPoint.RESUME, PainPoint.INTERVIEW_CONFIDENCE],
      interviewCount: 0,
    },
    skills: [],
    availability: { hoursPerWeek: 10, preferredMode: "async" as const },
    goal3Months: "Get a job",
  };

  const perfectMentor = {
    userId: "mentor1",
    company: "Tech Co",
    currentRole: "Senior Frontend Engineer",
    yearsExp: 5,
    domain: "Frontend",
    specialization: "React, Vue",
    helpTypes: ["resume", "guidance"] as Array<"1:1" | "resume" | "mock" | "resource" | "workshop" | "guidance">,
    painPointsCanHelp: [PainPoint.RESUME, PainPoint.INTERVIEW_CONFIDENCE, PainPoint.SYSTEM_DESIGN],
    menteeSeniority: [CareerStage.FRESHER, CareerStage.ONE_TO_THREE],
    availability: { hoursPerMonth: 10, preferredMode: "async" as const },
    maxMentees: 2,
    currentMenteeCount: 0,
    bio: "I help freshers.",
    shareSlug: "mentor-1",
    impactStats: { menteesHelped: 0, workshopsHosted: 0, testimonialsReceived: 0 },
  };

  const weakMentor = {
    userId: "mentor2",
    company: "Bank",
    currentRole: "Backend Engineer",
    yearsExp: 10,
    domain: "Finance",
    specialization: "Java",
    helpTypes: ["1:1"] as Array<"1:1" | "resume" | "mock" | "resource" | "workshop" | "guidance">,
    painPointsCanHelp: [PainPoint.SYSTEM_DESIGN],
    menteeSeniority: [CareerStage.EIGHT_PLUS],
    availability: { hoursPerMonth: 5, preferredMode: "calls" as const },
    maxMentees: 1,
    currentMenteeCount: 0,
    bio: "I do backend.",
    shareSlug: "mentor-2",
    impactStats: { menteesHelped: 0, workshopsHosted: 0, testimonialsReceived: 0 },
  };

  it("calculates a high score for a strong match", () => {
    const result = calculateMatchScore(mentee, perfectMentor);
    // Domain (40) + PainPoints (30) + Seniority (15) + Availability (10) + Mode (5) = 100
    expect(result.score).toBe(100);
    expect(result.mentorId).toBe("mentor1");
  });

  it("calculates a low score for a weak match", () => {
    const result = calculateMatchScore(mentee, weakMentor);
    // Domain (0) + PainPoints (0) + Seniority (0) + Availability (10) + Mode (0) = 10
    expect(result.score).toBe(10);
    expect(result.mentorId).toBe("mentor2");
  });

  it("ranks mentors correctly", () => {
    const results = rankMentors(mentee, [weakMentor, perfectMentor]);
    expect(results.length).toBe(2);
    expect(results[0].mentorId).toBe("mentor1");
    expect(results[1].mentorId).toBe("mentor2");
  });

  it("filters out mentors who are at capacity", () => {
    const busyMentor = { ...perfectMentor, userId: "mentor3", currentMenteeCount: 2, maxMentees: 2 };
    const results = rankMentors(mentee, [weakMentor, perfectMentor, busyMentor]);
    expect(results.length).toBe(2);
    expect(results.find(r => r.mentorId === "mentor3")).toBeUndefined();
  });
});
