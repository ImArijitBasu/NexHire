export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SEEKER' | 'EMPLOYER' | 'ADMIN';
  image?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  resume?: string;
  createdAt: string;
  company?: { id: string; name: string; slug: string; logo?: string };
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' | 'REMOTE';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  location: string;
  isRemote: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'EXPIRED';
  deadline?: string;
  benefits: string[];
  featured: boolean;
  views: number;
  companyId: string;
  categoryId?: string;
  createdAt: string;
  company: CompanyBrief;
  category?: CategoryBrief;
  _count?: { applications: number; savedBy: number };
}

export interface CompanyBrief {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  location?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  industry?: string;
  size?: string;
  founded?: string;
  website?: string;
  location?: string;
  email?: string;
  phone?: string;
  verified: boolean;
  ownerId: string;
  createdAt: string;
  _count?: { jobs: number; reviews: number };
  jobs?: Job[];
  reviews?: Review[];
}

export interface CategoryBrief {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  _count?: { jobs: number };
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  coverLetter?: string;
  resume?: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFERED' | 'REJECTED' | 'WITHDRAWN';
  notes?: string;
  createdAt: string;
  user?: User;
  job?: Job;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  authorId: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: string;
  author?: { name: string; image?: string; bio?: string };
}

export interface Review {
  id: string;
  userId: string;
  companyId: string;
  rating: number;
  title: string;
  content: string;
  pros?: string;
  cons?: string;
  createdAt: string;
  user?: { name: string; image?: string };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  link?: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AIResumeAnalysis {
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingKeywords: string[];
  formattingTips: string[];
  skillsAnalysis: { technical: string[]; soft: string[]; missing: string[] };
  atsScore: number;
  industryFit: string;
}

export interface AICoverLetter {
  coverLetter: string;
  keyPoints: string[];
  tone: string;
  wordCount: number;
  tips: string[];
}

export interface AIJobMatch {
  matches: Array<{
    jobId: string;
    matchScore: number;
    reasons: string[];
    missingSkills: string[];
    recommendation: string;
    job?: Job;
  }>;
  careerAdvice: string;
  trendingSkills: string[];
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'model';
  content: string;
  createdAt: string;
}
