'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Sparkles, ArrowRight, ArrowLeft, Users, Building2, User, Mail, Phone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { toast } from 'sonner';

type UserRole = 'job-seeker' | 'employer' | null;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'role' | 'details' | 'otp'>('role');
  const [role, setRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false
  });

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    setLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setStep('otp');
      toast.success('OTP sent to your phone! Use 123456 to verify.');
      setLoading(false);
    }, 1000);
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp !== '123456') {
      setError('Invalid OTP. Please use 123456');
      return;
    }

    setLoading(true);

    try {
      // Save user data to localStorage
      const userData = {
        ...formData,
        role,
        id: Date.now().toString(),
        onboardingComplete: false
      };

      localStorage.setItem('jobez_auth', 'true');
      localStorage.setItem('jobez_user', JSON.stringify(userData));

      toast.success('Account created successfully!');

      // Redirect to onboarding
      setTimeout(() => {
        router.push('/onboarding');
      }, 500);
    } catch (err) {
      setError('Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
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
            <div className={`h-2 w-20 rounded-full ${step === 'role' || step === 'details' || step === 'otp' ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 w-20 rounded-full ${step === 'details' || step === 'otp' ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 w-20 rounded-full ${step === 'otp' ? 'bg-primary' : 'bg-muted'}`} />
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
                  <Button className="w-full group-hover:bg-primary" variant="outline">
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
                  <Button className="w-full group-hover:bg-secondary" variant="outline">
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
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" />Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Muhammad Ali"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    disabled={loading}
                    className={touched.name && !formData.name ? 'border-destructive' : ''}
                  />
                  {touched.name && !formData.name && (
                    <p className="text-xs text-destructive">Name is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted-foreground" />Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="muhammad.ali@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    disabled={loading}
                    className={touched.email && formData.email && !validateEmail(formData.email) ? 'border-destructive' : ''}
                  />
                  {touched.email && formData.email && !validateEmail(formData.email) && (
                    <p className="text-xs text-destructive">Please enter a valid email address</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted-foreground" />Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onBlur={() => setTouched({ ...touched, phone: true })}
                    disabled={loading}
                    className={touched.phone && formData.phone && !validatePhone(formData.phone) ? 'border-destructive' : ''}
                  />
                  {touched.phone && formData.phone && !validatePhone(formData.phone) && (
                    <p className="text-xs text-destructive">Please enter a valid phone number (at least 10 digits)</p>
                  )}
                </div>

                {error && (
                  <p className={`text-sm ${error.includes('sent') ? 'text-primary' : 'text-destructive'}`}>
                    {error}
                  </p>
                )}

                <Button 
                  type="submit" 
                  className="w-full btn-press bg-primary hover:bg-primary/90" 
                  size="lg"
                  disabled={loading || !formData.name || !formData.email || !formData.phone}
                >
                  {loading ? (
                    <span className="shimmer">Sending OTP...</span>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: OTP Verification */}
        {step === 'otp' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Verify your phone</CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to {formData.phone}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOTPVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    disabled={loading}
                    className="text-lg text-center tracking-widest"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <p className={`text-sm ${error.includes('sent') ? 'text-primary' : 'text-destructive'}`}>
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setStep('details');
                      setOtp('');
                      setError('');
                    }}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={handleDetailsSubmit}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
