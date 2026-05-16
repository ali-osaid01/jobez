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

export default function OnboardingVerifyPage() {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [draft, setDraft] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('onboardingDraft');
      if (!raw) {
        router.push('/onboarding');
        return;
      }
      setDraft(JSON.parse(raw));
    } catch (e) {
      toast.error('Failed to load onboarding data');
      router.push('/onboarding');
    }
  }, [router]);

  const handleEdit = () => {
    router.push('/onboarding');
  };

  const handleConfirm = async () => {
    if (!draft) return;

    try {
      const body = {
        onboardingComplete: true,
        title: draft.title,
        experience: draft.experience,
        skills: draft.skills,
        location: draft.location,
        expectedSalary: draft.expectedSalary,
        education: draft.education,
        certifications: draft.certifications,
        workExperience: draft.workExperience,
        preferredRole: draft.preferredRole,
        bio: draft.bio,
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
          <div className="flex justify-between items-center h-16">
            <div />
            <Badge variant="secondary" className="px-4 py-2">Verify your information</Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Verify Your Profile</CardTitle>
            <CardDescription>Review the parsed information before we save it to your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Job Title</div>
              <div>{draft.title || 'Not specified'}</div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Preferred Role</div>
              <div className="capitalize">{draft.preferredRole?.replace('-', ' ') || 'Not specified'}</div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Experience</div>
              <div>{draft.experience || 'Not specified'}</div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Skills</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {draft.skills && draft.skills.length > 0 ? (
                  draft.skills.map((skill: string) => (
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
                {draft.education && draft.education.length > 0 ? (
                  draft.education.map((edu: any, idx: number) => (
                    <div key={idx} className="text-sm">{edu.degree} - {edu.institution} ({edu.year})</div>
                  ))
                ) : (
                  'No education added'
                )}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Location</div>
              <div>{draft.location || 'Not specified'}</div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleEdit}>
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
