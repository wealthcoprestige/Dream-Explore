export interface User {
  id: string;
  username: string | null;
  email: string;
  date_joined: string;
}

export interface Applicant {
  id: string;
  user: User;
  updated_at: string;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  whats_app: string;
  location: string;
  passport_number: string;
  nationality: string;
  id_card: string;
  card_image_front: string;
  card_image_back: string;
  date_of_birth: string;
  profile_photo: string;
  bio: string;
  linkedin_profile: string | null;
  website_or_portfolio: string | null;
  languages_spoken: string | null;
  education: string;
}

export const saveUserData = (applicant: Applicant, tokens: { access: string; refresh: string }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user_data', JSON.stringify(applicant));
    localStorage.setItem('user_id', applicant.user.id);
  }
};

export const getUserData = (): Applicant | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

export const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_id');
  }
  return null;
};

export const clearUserData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_id');
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};