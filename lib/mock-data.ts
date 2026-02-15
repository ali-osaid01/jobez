import type { Job, Interview, Application, AIInterviewQuestion } from './types';

// Mock jobs data
export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Systems Limited',
    location: 'Lahore, Pakistan',
    locationType: 'Hybrid',
    salary: '250,000 - 400,000 PKR',
    type: 'Full-time',
    experienceLevel: 'Senior',
    description: 'We are looking for a talented Senior Frontend Developer to join our dynamic team.',
    requirements: [
      '5+ years of experience with React',
      'Strong TypeScript skills',
      'Experience with Next.js',
      'UI/UX design sensibility'
    ],
    responsibilities: [
      'Build and maintain web applications',
      'Collaborate with design and backend teams',
      'Mentor junior developers',
      'Code reviews and technical documentation'
    ],
    benefits: [
      'Health insurance',
      'Remote work flexibility',
      'Provident fund',
      'Professional development budget'
    ],
    postedDate: '2024-01-15',
    employerId: 'emp1',
    matchScore: 95,
    applicantsCount: 24
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Netsol Technologies',
    location: 'Karachi, Pakistan',
    locationType: 'On-site',
    salary: '150,000 - 250,000 PKR',
    type: 'Full-time',
    experienceLevel: 'Mid',
    description: 'Join our creative team to design beautiful and intuitive user experiences.',
    requirements: [
      '3+ years of product design experience',
      'Proficiency in Figma',
      'Strong portfolio',
      'User research experience'
    ],
    responsibilities: [
      'Design user interfaces and experiences',
      'Conduct user research',
      'Create design systems',
      'Collaborate with product and engineering'
    ],
    benefits: [
      'Health and dental insurance',
      'Flexible hours',
      'Design conference budget',
      'Modern office space'
    ],
    postedDate: '2024-01-18',
    employerId: 'emp2',
    matchScore: 88,
    applicantsCount: 18
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'Techlogix',
    location: 'Islamabad, Pakistan',
    locationType: 'Remote',
    salary: '180,000 - 300,000 PKR',
    type: 'Full-time',
    experienceLevel: 'Mid',
    description: 'Build scalable applications from the ground up in a fast-paced environment.',
    requirements: [
      'Experience with Node.js and React',
      'Database design skills (PostgreSQL, MongoDB)',
      'API design and development',
      'Cloud platform experience (AWS/GCP)'
    ],
    responsibilities: [
      'Develop full-stack features',
      'Design and implement APIs',
      'Optimize database queries',
      'Deploy and monitor applications'
    ],
    benefits: [
      'Provident fund',
      'Flexible PTO',
      'Home office stipend',
      'Learning and development budget'
    ],
    postedDate: '2024-01-20',
    employerId: 'emp3',
    matchScore: 92,
    applicantsCount: 31
  }
];

// Mock interviews
export const mockInterviews: Interview[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'Systems Limited',
    applicantId: 'user1',
    applicantName: 'Ahmed Hassan',
    scheduledDate: '2024-02-01',
    scheduledTime: '10:00 AM',
    duration: 60,
    status: 'scheduled',
    type: 'ai',
    aiScore: 0
  },
  {
    id: '2',
    jobId: '2',
    jobTitle: 'Product Designer',
    company: 'Netsol Technologies',
    applicantId: 'user1',
    applicantName: 'Ayesha Khan',
    scheduledDate: '2024-01-28',
    scheduledTime: '2:00 PM',
    duration: 45,
    status: 'completed',
    type: 'ai',
    aiScore: 87,
    aiSummary: 'Strong communication skills and good technical knowledge. Demonstrated problem-solving abilities.'
  }
];

// Mock applications
export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'Systems Limited',
    applicantId: 'user1',
    applicantName: 'Ahmed Hassan',
    applicantEmail: 'ahmed.hassan@gmail.com',
    status: 'shortlisted',
    appliedDate: '2024-01-16',
    matchScore: 95
  },
  {
    id: '2',
    jobId: '2',
    jobTitle: 'Product Designer',
    company: 'Netsol Technologies',
    applicantId: 'user1',
    applicantName: 'Ayesha Khan',
    applicantEmail: 'ayesha.khan@gmail.com',
    status: 'shortlisted',
    appliedDate: '2024-01-19',
    matchScore: 88
  },
  {
    id: '3',
    jobId: '3',
    jobTitle: 'Full Stack Engineer',
    company: 'Techlogix',
    applicantId: 'user1',
    applicantName: 'Usman Ali',
    applicantEmail: 'usman.ali@gmail.com',
    status: 'pending',
    appliedDate: '2024-01-21',
    matchScore: 92
  }
];

// Mock AI interview questions
export const mockAIQuestions: AIInterviewQuestion[] = [
  {
    id: 'q1',
    question: 'Tell me about yourself and your professional background.',
    type: 'behavioral',
    category: 'Introduction',
    expectedDuration: 120
  },
  {
    id: 'q2',
    question: 'What interests you most about this position?',
    type: 'behavioral',
    category: 'Motivation',
    expectedDuration: 90
  },
  {
    id: 'q3',
    question: 'Describe a challenging project you worked on and how you overcame obstacles.',
    type: 'situational',
    category: 'Problem Solving',
    expectedDuration: 180
  },
  {
    id: 'q4',
    question: 'How do you stay updated with the latest industry trends and technologies?',
    type: 'behavioral',
    category: 'Learning',
    expectedDuration: 90
  },
  {
    id: 'q5',
    question: 'Walk me through your approach to solving a complex technical problem.',
    type: 'technical',
    category: 'Technical Skills',
    expectedDuration: 180
  },
  {
    id: 'q6',
    question: 'How do you handle disagreements with team members?',
    type: 'behavioral',
    category: 'Teamwork',
    expectedDuration: 120
  },
  {
    id: 'q7',
    question: 'What are your salary expectations and why?',
    type: 'behavioral',
    category: 'Compensation',
    expectedDuration: 60
  }
];

// Helper functions to simulate API calls
export const getJobById = (id: string): Job | undefined => {
  return mockJobs.find(job => job.id === id);
};

export const getApplicationsByUserId = (userId: string): Application[] => {
  return mockApplications.filter(app => app.applicantId === userId);
};

export const getInterviewsByUserId = (userId: string): Interview[] => {
  return mockInterviews.filter(interview => interview.applicantId === userId);
};

export const getJobsByEmployerId = (employerId: string): Job[] => {
  return mockJobs.filter(job => job.employerId === employerId);
};
