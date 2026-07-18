export enum UserRole {
  UNASSIGNED = 'unassigned',
  MENTEE = 'mentee',
  MENTOR = 'mentor',
  ADMIN = 'admin',
}

export enum CareerStage {
  FRESHER = 'fresher',
  ONE_TO_THREE = '1-3 yrs',
  THREE_TO_EIGHT = '3-8 yrs',
  EIGHT_PLUS = '8+ yrs',
  SWITCHER = 'career switcher',
}

export enum DiagnosticFunnelStage {
  NO_CALLS = 'no_calls',
  STUCK_ROUND_1 = 'stuck_round_1',
  FINAL_ROUND_REJECTS = 'final_round_rejects',
  LOW_OFFERS = 'low_offers',
}

export enum PainPoint {
  RESUME = 'resume',
  TECHNICAL_SKILLS = 'technical skills',
  COMMUNICATION = 'communication',
  INTERVIEW_CONFIDENCE = 'interview confidence',
  SYSTEM_DESIGN = 'system design',
  NEGOTIATION = 'negotiation',
  LACK_OF_REFERRALS = 'lack of referrals',
  CAREER_DIRECTION = 'career direction',
  EMPLOYMENT_GAP = 'employment gap',
  OTHER = 'other',
}

export enum MatchStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  onboardingComplete: boolean;
  linkedinId?: string;
  churchOrganization?: string;
  createdAt: Date;
}

export interface Skill {
  name: string;
  confidence: number;
}

export interface MenteeProfile {
  userId: string;
  status: 'unemployed' | 'underemployed' | 'employed-but-searching';
  careerStage: CareerStage;
  currentRole?: string;
  company?: string;
  highestQualification?: string;
  phoneNumber?: string;
  bio?: string;
  targetDomain: string;
  targetRoles: string[];
  targetCompanies?: string[];
  diagnosticAnswers: {
    funnelStage: DiagnosticFunnelStage;
    painPoints: PainPoint[];
    interviewCount: number;
  };
  resumeUrl?: string;
  skills: Skill[];
  availability: {
    hoursPerWeek: number;
    preferredMode: 'async' | 'calls' | 'workshops';
  };
  goal3Months: string;
}

export interface MentorProfile {
  userId: string;
  company: string;
  currentRole: string;
  yearsExp: number;
  domain: string;
  specialization: string;
  helpTypes: ('1:1' | 'resume' | 'mock' | 'resource' | 'workshop' | 'guidance')[];
  painPointsCanHelp: PainPoint[];
  menteeSeniority: CareerStage[];
  availability: {
    hoursPerMonth: number;
    preferredMode: 'async' | 'calls' | 'workshops';
  };
  maxMentees: number;
  currentMenteeCount: number;
  bio: string;
  shareSlug: string;
  impactStats: {
    menteesHelped: number;
    workshopsHosted: number;
    testimonialsReceived: number;
  };
}

export interface Match {
  _id: string;
  menteeId: string;
  mentorId: string;
  status: MatchStatus;
  matchScore: number;
  matchReason: string;
  createdAt: Date;
}

export interface Message {
  _id: string;
  matchId: string;
  senderId: string;
  content: string;
  type: 'text' | 'resource';
  attachments?: string[];
  createdAt: Date;
}

export interface Event {
  _id: string;
  hostId: string;
  title: string;
  description: string;
  painPointTags: PainPoint[];
  domain: string;
  isFree: boolean;
  price?: number;
  capacity: number;
  registeredCount: number;
  dateTime: Date;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  paymentSplit: {
    platformFeePercent: number;
  };
}

export interface EventRegistration {
  _id: string;
  eventId: string;
  userId: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'not_required';
  amountPaid: number;
  providerOrderId?: string;
}

export interface Testimonial {
  _id: string;
  authorId: string;
  mentorId?: string;
  painPoints: PainPoint[];
  whatHelped: string;
  outcome: string;
  freeText: string;
  flagged: boolean;
  createdAt: Date;
}

export interface MentorFeedback {
  _id: string;
  matchId: string;
  mentorId: string;
  menteeId: string;
  samePainPoint: boolean;
  observedPainPoints: PainPoint[];
  notes?: string;
  createdAt: Date;
}

export interface Resource {
  _id: string;
  sharedBy: string;
  matchId: string;
  url: string;
  title: string;
  description?: string;
  painPointTags: PainPoint[];
}
