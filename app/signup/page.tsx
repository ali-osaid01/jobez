'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, Building2, User, Mail, Phone, Lock, Chrome } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { toast } from 'sonner';
import { useGoogleLoginMutation, useSignupMutation } from '@/lib/store/api/authApi';
import type { ApiError } from '@/lib/store/types';
import type { UserRole } from '@/lib/auth';
import { validateSignupForm } from '@/lib/validations/signup.validation';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signup, { isLoading: loading }] = useSignupMutation();
  const [googleLogin, { isLoading: googleLoading }] = useGoogleLoginMutation();
  const [googleReady, setGoogleReady] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  useEffect(() => {
    if (!googleReady || !googleClientId || !window.google || !role) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (!response.credential) {
          toast.error('Google signup failed. Please try again.');
          return;
        }

        try {
          const { user } = await googleLogin({ credential: response.credential, role }).unwrap();
          toast.success('Signed in with Google');

          if (!user.onboardingComplete) {
            router.push('/onboarding');
          } else if (user.role === 'job-seeker') {
            router.push('/job-seeker/dashboard');
          } else {
            router.push('/employer/dashboard');
          }
        } catch (err) {
          const apiError = err as { data?: ApiError };
          toast.error(apiError.data?.error?.message ?? 'Google signup failed. Please try again.');
        }
      },
    });
  }, [googleReady, googleClientId, googleLogin, role, router]);

  const handleGoogleSignup = () => {
    if (!role) {
      toast.error('Please select a role first');
      return;
    }
    if (!googleClientId) {
      toast.error('Google login is not configured.');
      return;
    }
    if (!window.google) {
      toast.error('Google login is still loading. Please try again.');
      return;
    }

    window.google.accounts.id.prompt();
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateSignupForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!role) {
      toast.error('Please select a role');
      return;
    }

    setErrors({});

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role,
      }).unwrap();

      toast.success('Account created successfully!');
      router.push('/onboarding');
    } catch (err) {
      const apiError = err as { data?: ApiError };
      const details = apiError?.data?.error?.details;
      if (details) {
        setErrors(details);
      } else {
        toast.error(apiError.data?.error?.message ?? 'Failed to create account. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGoogleReady(true)}
      />
      {/* Header */}
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className={`h-2 w-20 rounded-full ${step === 'role' || step === 'details' ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 w-20 rounded-full ${step === 'details' ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 'role' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-heading font-bold">Choose your path</h1>
              <p className="text-muted-foreground text-lg">
                Select how you want to use JobEZ
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Card
                className="p-8 cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
                onClick={() => handleRoleSelect('job-seeker')}
              >
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Users className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold mb-2">Job Seeker</h3>
                    <p className="text-muted-foreground">
                      Find your dream job with AI-powered matching and instant applications
                    </p>
                  </div>
                  <Button className="w-full group-hover:bg-primary group-hover:text-white" variant="outline">
                    Continue as Job Seeker
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>

              <Card
                className="p-8 cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
                onClick={() => handleRoleSelect('employer')}
              >
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Building2 className="h-8 w-8 text-secondary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold mb-2">Employer</h3>
                    <p className="text-muted-foreground">
                      Post jobs, manage applications, and find top talent with AI screening
                    </p>
                  </div>
                  <Button className="w-full group-hover:bg-secondary group-hover:text-white" variant="outline">
                    Continue as Employer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Create your account</CardTitle>
              <CardDescription>
                Signing up as a <span className="font-semibold text-foreground capitalize">{role}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="outline"
                className="mb-4 w-full"
                onClick={handleGoogleSignup}
                disabled={loading || googleLoading || !googleClientId}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or create with password</span>
                </div>
              </div>

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" />Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Muhammad Ali"
                    value={formData.name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }); clearError('name'); }}
                    disabled={loading}
                    className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted-foreground" />Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="muhammad.ali@gmail.com"
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearError('email'); }}
                    disabled={loading}
                    className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted-foreground" />Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); clearError('phone'); }}
                    disabled={loading}
                    className={errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-muted-foreground" />Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }); clearError('password'); }}
                    disabled={loading}
                    className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full btn-press bg-primary hover:bg-primary/90"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="shimmer">Creating account...</span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
