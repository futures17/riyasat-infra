import { createClient } from '@supabase/supabase-js';

// Parse environment variables (provide defaults to prevent crashes during dev if not set yet)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Basic types for our tables
export type Visit = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  preferred_date: string;
  message?: string;
  ref_id?: string | null;
  status: 'pending' | 'postponed' | 'completed' | 'cancelled';
  visit_status?: 'scheduled' | 'completed' | 'cancelled';
  is_deleted?: boolean;
  created_at: string;
};

export type ContactRequest = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status?: 'new' | 'read' | 'responded';
  source_page?: 'home' | 'project' | 'contact' | string | null;
  is_deleted?: boolean;
  created_at: string;
};

export type Feedback = {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  phone_e164?: string | null;
  status?: 'hidden' | 'shown';
  is_deleted?: boolean;
  client_id?: string | null;
  created_at: string;
};

export type Member = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'agent' | 'reception';
  status: 'pending' | 'active' | 'suspended';
  membership_type?: 'new' | 'existing';
  photo_url?: string;
  activity_count?: number;
  ref_id_generated?: string;
  created_at: string;
};

export type Job = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  requirements?: string | null;
  image_url?: string | null;
  created_at: string;
};

export type JobApplication = {
  id: string;
  job_id: string;
  full_name: string;
  phone: string;
  email: string;
  gender?: string | null;
  resume_url?: string | null;
  status?: 'new' | 'reviewed' | 'rejected' | 'selected';
  created_at: string;
  jobs?: Job | null;
};

export type Meeting = {
  id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  assigned_to: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
};
