// Database types
export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface Run {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at: string | null;
}

export interface Job {
  id: string;
  run_id: string;
  title: string;
  company: string;
  location: string;
  score: number;
  description: string;
  apply_link: string;
  cover_letter: string;
  mail_draft: string;
  created_at: string;
}

// API types
export interface Filters {
  keywords: string;
  location: string;
  experienceLevel: string[];
  remote: string[];
  jobType: string[];
  easyApply: boolean;
  minScore?: number;
}

export interface CreateRunRequest {
  filters: Filters;
}

export interface CreateRunResponse {
  runId: string;
}

export interface RunWithJobs extends Run {
  jobs: Job[];
  jobCount?: number;
  highMatchCount?: number;
}

export interface N8nWebhookPayload {
  runId: string;
  userId: string;
  resumeUrl: string;
  filters: {
    keywords: string;
    location: string;
    experienceLevel: string;
    remote: string;
    jobType: string;
    easyApply: boolean;
    minScore?: number;
  };
}

export interface N8nCallbackPayload {
  runId: string;
  secret: string;
  jobs: Array<{
    title: string;
    company: string;
    location: string;
    score: number;
    description: string;
    applyLink: string;
    coverLetter: string;
    mailDraft: string;
  }>;
}
