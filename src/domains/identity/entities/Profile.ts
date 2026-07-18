// Identity Domain — Profile entity.

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  locale: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  name?: string;
  avatar_url?: string | null;
  locale?: string;
  phone?: string | null;
}
