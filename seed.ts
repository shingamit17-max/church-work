import dbConnect from "./lib/db";
import { User } from "./models/User";
import { MentorProfile } from "./models/MentorProfile";
import { MenteeProfile } from "./models/MenteeProfile";
import bcrypt from "bcryptjs";

async function seed() {
  await dbConnect();
  
  const password = await bcrypt.hash("password123", 10);
  
  // Create Mentor
  const mentor = new User({
    name: "Test Mentor",
    email: "mentor@test.com",
    password,
    role: "mentor",
    onboardingComplete: true
  });
  await mentor.save();
  
  const mentorProfile = new MentorProfile({
    userId: mentor._id,
    company: "Tech Corp",
    currentRole: "Senior Engineer",
    yearsExp: 5,
    domain: "Engineering",
    specialization: "Frontend",
    helpTypes: ["resume", "mock_interview"],
    painPointsCanHelp: ["react_hooks", "system_design"],
    menteeSeniority: ["fresher", "junior"],
    availability: "2 hours/week",
    maxMentees: 3,
    currentMenteeCount: 0,
    bio: "I am a test mentor.",
    shareSlug: "test-mentor"
  });
  await mentorProfile.save();
  
  // Create Mentee
  const mentee = new User({
    name: "Test Mentee",
    email: "mentee@test.com",
    password,
    role: "mentee",
    onboardingComplete: true
  });
  await mentee.save();
  
  const menteeProfile = new MenteeProfile({
    userId: mentee._id,
    status: "unemployed",
    careerStage: "fresher",
    targetDomain: "Engineering",
    targetRoles: ["Frontend Developer"],
    diagnosticAnswers: {
      funnelStage: "no_calls",
      painPoints: ["react_hooks"],
      interviewCount3Months: 0
    },
    skills: [{ name: "React", confidence: 3 }],
    availability: "Full time",
    goal3Months: "Get a job"
  });
  await menteeProfile.save();
  
  console.log("Seeding complete! You can log in with mentor@test.com and mentee@test.com (password: password123)");
  process.exit(0);
}

seed().catch(console.error);
