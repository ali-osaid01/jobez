'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole?: 'job-seeker' | 'employer';
}

export function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/role-selection'];
    
    if (publicRoutes.includes(pathname)) {
      return;
    }

    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Check role if required
    if (requiredRole) {
      const user = auth.getUser();
      if (!user || user.role !== requiredRole) {
        // Redirect to correct dashboard based on user role
        if (user?.role === 'job-seeker') {
          router.push('/job-seeker/dashboard');
        } else if (user?.role === 'employer') {
          router.push('/employer/dashboard');
        } else {
          router.push('/login');
        }
      }
    }
  }, [pathname, router, requiredRole]);

  return <>{children}</>;
}
