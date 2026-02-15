// Mock authentication utility using localStorage
export type UserRole = 'job-seeker' | 'employer';

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  name?: string;
  company?: string;
}

const AUTH_KEY = 'jobez_auth';
const USER_KEY = 'jobez_user';

export const auth = {
  // Generate and store OTP (mock - in production this would be sent via SMS/email)
  sendOTP: async (phone: string): Promise<{ success: boolean; message: string }> => {
    // Mock OTP generation
    const otp = '123456'; // In production, this would be randomly generated and sent
    localStorage.setItem(`otp_${phone}`, otp);
    localStorage.setItem(`otp_time_${phone}`, Date.now().toString());
    
    return {
      success: true,
      message: `OTP sent to ${phone}. Use 123456 to login.`
    };
  },

  // Verify OTP
  verifyOTP: async (phone: string, otp: string): Promise<{ success: boolean; message: string }> => {
    const storedOTP = localStorage.getItem(`otp_${phone}`);
    const otpTime = localStorage.getItem(`otp_time_${phone}`);
    
    // Check if OTP exists and is not expired (5 minutes)
    if (!storedOTP || !otpTime) {
      return { success: false, message: 'OTP not found. Please request a new one.' };
    }
    
    const timeElapsed = Date.now() - parseInt(otpTime);
    if (timeElapsed > 5 * 60 * 1000) {
      return { success: false, message: 'OTP expired. Please request a new one.' };
    }
    
    if (storedOTP !== otp) {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }
    
    // Clear OTP after successful verification
    localStorage.removeItem(`otp_${phone}`);
    localStorage.removeItem(`otp_time_${phone}`);
    
    return { success: true, message: 'OTP verified successfully.' };
  },

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
