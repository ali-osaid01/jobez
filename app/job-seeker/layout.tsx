'use client';

import { AuthWrapper } from '@/components/auth-wrapper';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  User, 
  LogOut, 
  Sparkles,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const navigation = [
  { name: 'Dashboard', href: '/job-seeker/dashboard', icon: LayoutDashboard },
  { name: 'All Jobs', href: '/job-seeker/all-jobs', icon: Briefcase },
  { name: 'Recommended', href: '/job-seeker/jobs', icon: Sparkles },
  { name: 'My Applications', href: '/job-seeker/applications', icon: FileText },
  { name: 'Interviews', href: '/job-seeker/interviews', icon: Calendar },
  { name: 'Profile', href: '/job-seeker/profile', icon: User },
];

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  return (
    <AuthWrapper requiredRole="job-seeker">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-screen-2xl mx-auto w-full flex h-16 items-center justify-between px-4 lg:px-8">
            <div>
              <Logo size="sm" showText={true} />
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <aside className="md:w-64 flex-shrink-0">
              <nav className="space-y-1 sticky top-24">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className="w-full justify-start gap-3"
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
