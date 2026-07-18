export const MENTEE_DEFAULT_STEPS = [
  { 
    id: "status", 
    title: "Employment Status", 
    hint: "Tell us where you're at right now",
    options: [
      { value: "unemployed", label: "Unemployed and actively looking", icon: "🔍" },
      { value: "underemployed", label: "Underemployed / Freelancing", icon: "⚡" },
      { value: "employed-but-searching", label: "Employed but looking to switch", icon: "↗️" },
    ]
  },
  { 
    id: "careerStage", 
    title: "Career Stage", 
    hint: "How far along is your career journey?",
  },
  { id: "domain", title: "Target Domain & Roles", hint: "What are you aiming for?" },
  { 
    id: "funnel", 
    title: "Where You're Stuck", 
    hint: "Identify the bottleneck in your job search",
    options: [
      { value: "no_calls", label: "Not getting interview calls" },
      { value: "stuck_round_1", label: "Stuck after Round 1 / HR screening" },
      { value: "final_round_rejects", label: "Reaching finals but getting rejected" },
      { value: "low_offers", label: "Getting offers but below expectation" },
    ]
  },
  { id: "painPoints", title: "Pain Points", hint: "What specific challenges are you facing?" },
  { 
    id: "interviews", 
    title: "Interview History", 
    hint: "Help us gauge your experience level",
    options: [
      { value: "0", label: "0 (None yet)" },
      { value: "1", label: "1 to 3 interviews" },
      { value: "4", label: "4 to 10 interviews" },
      { value: "10", label: "10+ interviews" },
    ]
  },
  { id: "skills", title: "Skills & Resume", hint: "Show your strengths and upload your CV" },
  { 
    id: "availability", 
    title: "Availability", 
    hint: "How much time can you commit?",
    options: [
      { value: "async", label: "Async chat & resources", icon: "💬" },
      { value: "calls", label: "1:1 video calls", icon: "📹" },
      { value: "workshops", label: "Group workshops", icon: "👥" },
    ]
  },
  { id: "goal", title: "3-Month Goal", hint: "What does success look like for you?" },
];

export const MENTOR_DEFAULT_STEPS = [
  { id: "background", title: "Professional Background", hint: "Tell us about your current role" },
  { id: "domain", title: "Domain & Specialization", hint: "What's your area of expertise?" },
  { 
    id: "helpTypes", 
    title: "How You Can Help", 
    hint: "What formats of mentorship do you offer?",
    options: [
      { value: '1:1', label: '1:1 Mentorship Calls' },
      { value: 'resume', label: 'Resume Review' },
      { value: 'mock', label: 'Mock Interviews' },
      { value: 'resource', label: 'Resource Sharing' },
      { value: 'workshop', label: 'Hosting Workshops' },
      { value: 'guidance', label: 'Career Guidance' },
    ]
  },
  { id: "painPoints", title: "Pain Points", hint: "What specific challenges can you help mentees with?" },
  { id: "targetMentees", title: "Target Mentees", hint: "Who are you best equipped to help?" },
  { 
    id: "availability", 
    title: "Availability", 
    hint: "How much time can you commit?",
    options: [
      { value: "async", label: "Async Chat / Resources" },
      { value: "calls", label: "1:1 Video Calls" },
      { value: "workshops", label: "Workshops / Group Sessions" },
    ]
  },
  { id: "final", title: "Final Touches", hint: "Your bio and public profile link" },
];
