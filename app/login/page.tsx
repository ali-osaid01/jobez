'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Sparkles, Users, Building2, Chrome, Github, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { toast } from 'sonner';

type UserRole = 'job-seeker' | 'employer' | null;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Check if user exists in localStorage (mock login)
      const existingUser = localStorage.getItem('jobez_user');
      
      if (existingUser) {
        const user = JSON.parse(existingUser);
        localStorage.setItem('jobez_auth', 'true');
        toast.success('Welcome back!');

        // Redirect based on role and onboarding status
        if (user.onboardingComplete) {
          if (user.role === 'job-seeker') {
            router.push('/job-seeker/dashboard');
          } else {
            router.push('/employer/dashboard');
          }
        } else {
          router.push('/onboarding');
        }
      } else {
        setError('Account not found. Please sign up first.');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-primary/90 to-secondary text-white gradient-animate">
        <Link href="/" className="slide-in-left">
          <div className="invert brightness-0">
            <Logo size="md" />
          </div>
        </Link>

        <div className="space-y-8 animate-fade-in-up animate-delay-200">
          <h1 className="text-5xl font-heading font-bold text-balance leading-tight">
            Your entire job search, simplified.
          </h1>
          <p className="text-xl text-white/90 text-balance">
            Join thousands of job seekers who have landed roles at top companies using JobEZ.
          </p>

          <Card className="bg-white/10 backdrop-blur border-white/20 text-white hover-lift">
            <CardContent className="p-6">
              <p className="text-sm italic mb-4">
                "JobEZ helped me land my dream role at Systems Limited in just 3 weeks. The auto-fill feature alone saved me hundreds of hours."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                  FR
                </div>
                <div>
                  <div className="font-semibold text-sm">Fatima Rizwan</div>
                  <div className="text-xs text-white/80">Software Engineer at Systems Limited</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-white/70">
            Trusted by 10,000+ job seekers worldwide
          </p>
        </div>

        <div />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md border-none shadow-none slide-in-right">
          <CardHeader className="space-y-1 pb-8">
            <div className="lg:hidden mb-6 text-center">
              <Link href="/" className="inline-flex">
                <Logo size="md" />
              </Link>
            </div>
            <CardTitle className="text-3xl font-heading font-bold">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted-foreground" />Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-muted-foreground" />Password</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full btn-press bg-primary hover:bg-primary/90" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="pulse-subtle">Signing in...</span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" disabled className="hover-lift">
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" disabled className="hover-lift">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/signup" className="text-primary font-semibold hover:underline">
                Create one free
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
