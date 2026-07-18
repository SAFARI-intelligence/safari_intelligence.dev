// Identity Domain — Profile entity aligned with public.profiles schema.

export type PreferenceValue = string | number | boolean | null | PreferenceValue[] | { [k: string]: PreferenceValue };
export type Preferences = { [key: string]: PreferenceValue };

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  profile_image: string | null;
  preferences: Preferences;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  name?: string;
  profile_image?: string | null;
  preferences?: Preferences;
}
