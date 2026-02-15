export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type ExperienceLevel = 'Entry' | 'Mid' | 'Senior' | 'Lead';
export type JobLocation = 'Remote' | 'On-site' | 'Hybrid';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: JobLocation;
  salary: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedDate: string;
  applicationDeadline?: string;
  employerId: string;
  matchScore?: number;
  applicantsCount?: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  status: 'pending' | 'shortlisted' | 'interview-scheduled' | 'rejected' | 'hired';
  appliedDate: string;
  resume?: string;
  coverLetter?: string;
  matchScore?: number;
}

export interface Interview {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantId: string;
  applicantName?: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  type: 'ai' | 'human';
  meetingLink?: string;
  notes?: string;
  aiScore?: number;
  aiSummary?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'job-seeker' | 'employer';
  // Job seeker specific
  title?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  resume?: string;
  bio?: string;
  // Employer specific
  company?: string;
  companySize?: string;
  industry?: string;
  website?: string;
}

export interface AIInterviewQuestion {
  id: string;
  question: string;
  type: 'technical' | 'behavioral' | 'situational';
  category: string;
  expectedDuration: number; // in seconds
}

export interface AIInterviewResponse {
  questionId: string;
  response: string;
  duration: number;
  timestamp: string;
}

export interface AIInterviewResult {
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  cultureFitScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  responses: AIInterviewResponse[];
}
