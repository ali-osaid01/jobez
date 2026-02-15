'use client';

import { AuthWrapper } from '@/components/auth-wrapper';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  Building2, 
  LogOut,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const navigation = [
  { name: 'Dashboard', href: '/employer/dashboard', icon: LayoutDashboard },
  { name: 'My Jobs', href: '/employer/jobs', icon: Briefcase },
  { name: 'Applicants', href: '/employer/applicants', icon: Users },
  { name: 'Interviews', href: '/employer/interviews', icon: Calendar },
  { name: 'Company Profile', href: '/employer/profile', icon: Building2 },
];

export default function EmployerLayout({
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
    <AuthWrapper requiredRole="employer">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-screen-2xl mx-auto w-full flex h-16 items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-2">
              <Logo size="sm" showText={true} />
              <span className="text-sm text-muted-foreground">Employer</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/employer/jobs/new">
                <Button className="gap-2 bg-secondary hover:bg-secondary/90">
                  <PlusCircle className="h-4 w-4" />
                  Post Job
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
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
                        className={`w-full justify-start gap-3 ${isActive ? 'bg-secondary hover:bg-secondary/90' : ''}`}
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
