// Mock authentication utility using localStorage
export type UserRole = 'job-seeker' | 'employer';

export interface User {
  id: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  name?: string;
  company?: string;
}

const AUTH_KEY = 'jobez_auth';
const USER_KEY = 'jobez_user';

export const auth = {
  // Store auth session
  login: (user: User) => {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get current user
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  // Logout
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Update user profile
  updateUser: (updates: Partial<User>) => {
    const user = auth.getUser();
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }
};
