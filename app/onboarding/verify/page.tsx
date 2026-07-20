'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentUser } from '@/lib/store/features/authSlice';
import { useUpdateProfileMutation } from '@/lib/store/api/profileApi';
import { toast } from 'sonner';

type OnboardingDraft = {
  step?: number;
  seekerData?: {
    title?: string;
    experience?: string;
    skills?: string[];
    location?: string;
    expectedSalary?: string;
    education?: { degree: string; institution: string; year: string }[];
    certifications?: string[];
    workExperience?: { title: string; company: string; duration: string }[];
    preferredRole?: string;
    bio?: string;
  };
  title?: string;
  experience?: string;
  skills?: string[];
  location?: string;
  expectedSalary?: string;
  education?: { degree: string; institution: string; year: string }[];
  certifications?: string[];
  workExperience?: { title: string; company: string; duration: string }[];
  preferredRole?: string;
  bio?: string;
};

export default function OnboardingVerifyPage() {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [draft, setDraft] = useState<OnboardingDraft | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('onboardingDraft');
      if (!raw) {
        router.push('/onboarding');
        return;
      }
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === 'object') {
        setDraft(parsed as OnboardingDraft);
      } else {
        router.push('/onboarding');
      }
    } catch (e) {
      toast.error('Failed to load onboarding data');
      router.push('/onboarding');
    }
  }, [router]);

  const data = draft?.seekerData ?? draft;

  const handleEdit = () => {
    if (draft) {
      sessionStorage.setItem('onboardingDraft', JSON.stringify({
        ...draft,
        step: 1,
      }));
    }
    router.push('/onboarding');
  };

  const handleConfirm = async () => {
    if (!draft) return;

    try {
      const body = {
        onboardingComplete: true,
        title: data?.title,
        experience: data?.experience,
        skills: data?.skills,
        location: data?.location,
        expectedSalary: data?.expectedSalary,
        education: data?.education,
        certifications: data?.certifications,
        workExperience: data?.workExperience,
        preferredRole: data?.preferredRole,
        bio: data?.bio,
      };

      await updateProfile(body).unwrap();
      toast.success('Profile verified and saved');
      sessionStorage.removeItem('onboardingDraft');

      if (user?.role === 'job-seeker') {
        router.push('/job-seeker/dashboard');
      } else {
        router.push('/employer/dashboard');
      }
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  if (!draft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <div />
            <Badge variant="secondary" className="px-3 py-2 text-center sm:px-4">Verify your information</Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-heading sm:text-2xl">Verify Your Profile</CardTitle>
            <CardDescription>Review the parsed information before we save it to your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Job Title</div>
              <div>{data?.title || 'Not specified'}</div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Preferred Role</div>
              <div className="capitalize">{data?.preferredRole?.replace('-', ' ') || 'Not specified'}</div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Experience</div>
              <div>{data?.experience || 'Not specified'}</div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Skills</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {data?.skills && data.skills.length > 0 ? (
                  data.skills.map((skill: string) => (
                    <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-sm">{skill}</span>
                  ))
                ) : (
                  'No skills added'
                )}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Education</div>
              <div className="space-y-2">
                {data?.education && data.education.length > 0 ? (
                  data.education.map((edu: any, idx: number) => (
                    <div key={idx} className="text-sm">{edu.degree} - {edu.institution} ({edu.year})</div>
                  ))
                ) : (
                  'No education added'
                )}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Location</div>
              <div>{data?.location || 'Not specified'}</div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" onClick={handleEdit} className="sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={handleConfirm} className="flex-1" disabled={isLoading}>
                {isLoading ? 'Saving...' : (
                  <>
                    Confirm & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
