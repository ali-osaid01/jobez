'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import {
  selectIsAuthenticated,
  selectUserRole,
} from '@/lib/store/features/authSlice';

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole?: 'job-seeker' | 'employer';
}

export function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);

  useEffect(() => {
    const publicRoutes = ['/login', '/signup', '/role-selection'];

    if (publicRoutes.includes(pathname)) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      if (userRole === 'job-seeker') {
        router.push('/job-seeker/dashboard');
      } else if (userRole === 'employer') {
        router.push('/employer/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [pathname, router, requiredRole, isAuthenticated, userRole]);

  return <>{children}</>;
}
