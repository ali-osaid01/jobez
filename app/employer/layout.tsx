'use client';

import { AuthWrapper } from '@/components/auth-wrapper';
import { useRouter, usePathname } from 'next/navigation';
import { useLogoutMutation } from '@/lib/store/api/authApi';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  Building2, 
  LogOut,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { NotificationsMenu } from '@/components/notifications-menu';

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
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Still navigate to login even if API call fails
    }
    router.push('/login');
  };

  const renderNavLinks = (mobile = false) => (
    navigation.map((item) => {
      const isActive = pathname === item.href;
      const navLink = (
        <Button
          asChild
          variant={isActive ? 'default' : 'ghost'}
          className={`w-full justify-start gap-3 ${isActive ? 'bg-secondary hover:bg-secondary/90' : ''}`}
        >
          <Link href={item.href}>
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        </Button>
      );

      return mobile ? (
        <SheetClose asChild key={item.name}>
          {navLink}
        </SheetClose>
      ) : (
        <div key={item.name}>{navLink}</div>
      );
    })
  );

  return (
    <AuthWrapper requiredRole="employer">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-screen-2xl mx-auto w-full flex h-16 items-center justify-between gap-2 px-3 sm:px-4 lg:px-8">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle className="sr-only">Employer navigation</SheetTitle>
                    <Logo size="sm" showText={true} />
                  </SheetHeader>
                  <nav className="space-y-1">
                    {renderNavLinks(true)}
                  </nav>
                </SheetContent>
              </Sheet>
              <Logo size="sm" showText={true} />
              <span className="text-sm text-muted-foreground">Employer</span>
            </div>
            <div className="flex items-center gap-2">
              {/* <Link href="/employer/jobs/new">
                <Button className="gap-2 bg-secondary hover:bg-secondary/90">
                  <PlusCircle className="h-4 w-4" />
                  Post Job
                </Button>
              </Link> */}
              <NotificationsMenu />
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <aside className="hidden md:block md:w-64 flex-shrink-0">
              <nav className="space-y-1 sticky top-24">
                {renderNavLinks()}
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
