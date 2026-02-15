'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, FileText, Calendar, BarChart3, ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const heroRef = useScrollAnimation({ threshold: 0.1 });
  const statsRef = useScrollAnimation({ threshold: 0.2 });
  const featuresRef = useScrollAnimation({ threshold: 0.1 });
  const testimonialsRef = useScrollAnimation({ threshold: 0.1 });
  const ctaRef = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      // Check if user is already logged in
      const authStatus = localStorage.getItem('jobez_auth');
      const userStr = localStorage.getItem('jobez_user');

      if (authStatus === 'true' && userStr) {
        const user = JSON.parse(userStr);
        if (user?.role === 'job-seeker') {
          router.replace('/job-seeker/dashboard');
        } else if (user?.role === 'employer') {
          router.replace('/employer/dashboard');
        }
      }
    } catch (error) {
      console.error('[v0] Error checking auth:', error);
    }
  }, [router, mounted]);

  const features = [
    {
      icon: Search,
      title: 'Smart Job Discovery',
      description: 'AI-powered recommendations match you with perfect roles based on your skills and experience.'
    },
    {
      icon: FileText,
      title: 'One-Click Apply',
      description: 'Fill out job applications instantly. Our AI completes forms in seconds.'
    },
    {
      icon: Calendar,
      title: 'AI Interviews',
      description: 'Practice with AI-powered interviews and get detailed feedback on your performance.'
    },
    {
      icon: BarChart3,
      title: 'Application Tracker',
      description: 'Track every application from submission to offer. Stay organized throughout your search.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      content: 'JobEZ helped me land my dream role at Google in just 3 weeks. The auto-fill feature alone saved me hundreds of hours.',
      avatar: 'SC'
    },
    {
      name: 'Marcus Williams',
      role: 'Product Manager at Stripe',
      content: 'The interview prep AI was incredibly accurate - I felt prepared for every single interview question.',
      avatar: 'MW'
    },
    {
      name: 'Priya Sharma',
      role: 'UX Designer at Airbnb',
      content: 'The AI recommendations helped me discover roles I never would have found. The application tracker kept me organized.',
      avatar: 'PS'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-base font-medium">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button className="text-base font-semibold px-6 rounded-full bg-primary hover:bg-primary/90">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background pattern and floating elements */}
        <div className="absolute inset-0 bg-dot-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        <div className="absolute top-10 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-[5%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-primary/3 rounded-full blur-3xl animate-float-slow" />

        {/* Floating decorative shapes */}
        <div className="absolute top-24 right-[15%] animate-float opacity-20">
          <Briefcase className="h-12 w-12 text-primary" />
        </div>
        <div className="absolute top-48 left-[8%] animate-float-delayed opacity-15">
          <Search className="h-10 w-10 text-secondary" />
        </div>
        <div className="absolute bottom-32 right-[12%] animate-float-slow opacity-15">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute top-64 right-[35%] animate-float opacity-10">
          <FileText className="h-8 w-8 text-secondary" />
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-20 pb-32 relative z-10">
          <div ref={heroRef.ref} className={`text-center space-y-8 transition-all duration-1000 ${heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.15]">
                Your entire job search.
                <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-text">
                  Powered by one profile.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Get personalized job recommendations, craft tailored resumes, autofill and track your job applications. We're here for every step of the process.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/signup">
                <Button size="lg" className="text-base font-semibold px-10 h-14 rounded-full hover-scale btn-press shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all duration-300">
                  Sign Up - It&apos;s Free!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <p className="text-base text-muted-foreground pt-2">
              Join <span className="font-semibold text-foreground">1,000,000+</span> job seekers who use JobEZ
            </p>
          </div>

          {/* Feature Icons */}
          <div ref={statsRef.ref} className={`grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 transition-all duration-700 ${statsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { icon: Search, label: 'Job Matches' },
              { icon: FileText, label: 'AI Applications' },
              { icon: Briefcase, label: 'Resume Builder' },
              { icon: BarChart3, label: 'Job Tracker' }
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 text-center group transition-all duration-500"
                style={{ transitionDelay: statsRef.isVisible ? `${index * 100}ms` : '0ms' }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* We're here for every step */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-white relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div ref={featuresRef.ref} className={`text-center space-y-6 mb-20 transition-all duration-1000 ${featuresRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold leading-tight">
              We&apos;re here for <span className="text-primary">every step</span> of your search.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tell us about your career history and goals. We&apos;ll help you craft a standout profile and help you land your dream job.
            </p>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20 transition-all duration-700 ${featuresRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: featuresRef.isVisible ? `${200 + index * 150}ms` : '0ms' }}
                >
                  <div className="flex-1 space-y-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-heading font-bold text-foreground">{feature.title}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border hover-lift flex items-center justify-center group">
                      <feature.icon className="h-24 w-24 text-primary/30 group-hover:text-primary/50 group-hover:scale-110 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={testimonialsRef.ref} className={`text-center space-y-6 mb-20 transition-all duration-1000 ${testimonialsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold">
              Join over <span className="text-primary">1,000,000</span> candidates that hear back <span className="text-secondary">25% more</span> with JobEZ
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group p-8 bg-slate-50 rounded-2xl hover-lift border border-transparent hover:border-primary/20 transition-all duration-500 ${testimonialsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: testimonialsRef.isVisible ? `${200 + index * 150}ms` : '0ms' }}
              >
                <div className="space-y-6">
                  <p className="text-lg font-medium text-foreground leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-base">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-primary via-primary to-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
        {/* Floating shapes in CTA */}
        <div className="absolute top-10 left-[10%] w-32 h-32 border border-white/10 rounded-full animate-float" />
        <div className="absolute bottom-10 right-[15%] w-24 h-24 border border-white/10 rounded-full animate-float-delayed" />
        <div className="absolute top-1/2 left-[5%] w-16 h-16 bg-white/5 rounded-lg rotate-45 animate-float-slow" />
        <div ref={ctaRef.ref} className={`max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-10 relative z-10 transition-all duration-1000 ${ctaRef.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold leading-tight">
            Ready to supercharge your job search?
          </h2>
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Join thousands of job seekers who have already landed their dream roles with JobEZ.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg font-semibold px-12 h-16 rounded-full hover-scale btn-press shadow-2xl bg-white text-primary hover:bg-slate-50 mt-4">
              Sign Up - It&apos;s Free!
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Logo size="md" />
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">About</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            </div>
            <p className="text-sm text-muted-foreground">&copy; 2026 JobEZ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
