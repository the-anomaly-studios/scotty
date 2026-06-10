export type Job = {
  id: string;
  posted_by: string;
  title: string;
  company: string;
  location: string;
  work_type: "remote" | "hybrid" | "onsite";
  employment_type: "full-time" | "part-time" | "contract" | "internship";
  description: string;
  application_url: string;
  created_at: string;
  expires_at: string;
  poster: { id: string; name: string | null } | null;
};

export type Profile = {
  id: string;
  user_id: string | null;
  email: string;
  name: string | null;
  graduation_year: number | null;
  headshot_url: string | null;
  linkedin_url: string | null;
  bio: string | null;
  role: string | null;
  company: string | null;
  location: string | null;
  personal_email: string | null;
  website: string | null;
  instagram: string | null;
  x: string | null;
  bluesky: string | null;
  tiktok: string | null;
  skills: string[];
  is_mentorship_open: boolean;
  is_featured_eligible: boolean;
  is_active: boolean;
  updated_at: string;
};
