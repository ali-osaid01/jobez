'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Briefcase, Download, GraduationCap, MapPin, Mail, Phone, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCandidateProfileQuery } from '@/lib/store';

function SectionList({ items, empty }: { items?: string[] | null; empty: string }) {
  if (!items?.length) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item} variant="secondary">
          {item}
        </Badge>
      ))}
    </div>
  );
}

export default function CandidateProfilePage() {
  const params = useParams();
  const candidateId = params.id as string;
  const { data: profile, isLoading, isError } = useGetCandidateProfileQuery(candidateId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <UserRound className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
        <h1 className="text-2xl font-bold">Candidate profile unavailable</h1>
        <p className="text-muted-foreground mt-2">
          This profile can only be viewed for candidates who applied to your jobs.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/employer/applicants">Back to applicants</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="gap-2">
        <Link href="/employer/applicants">
          <ArrowLeft className="h-4 w-4" />
          Back to applicants
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <UserRound className="h-7 w-7 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">{profile.name}</CardTitle>
                <p className="text-lg text-muted-foreground mt-1">{profile.title || 'Candidate'}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </span>
                  {profile.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {profile.phone}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {profile.resumeUrl && (
              <Button asChild variant="outline" className="gap-2">
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </Button>
            )}
          </div>
        </CardHeader>
        {profile.bio && (
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
          </CardContent>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SectionList items={profile.skills} empty="No skills added yet." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <SectionList items={profile.certifications} empty="No certifications added yet." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.workExperience?.length ? (
              profile.workExperience.map((item, index) => (
                <div key={`${item.company}-${item.title}-${index}`} className="border-l-2 pl-4">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.duration}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No work experience added yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.education?.length ? (
              profile.education.map((item, index) => (
                <div key={`${item.institution}-${item.degree}-${index}`} className="border-l-2 pl-4">
                  <p className="font-medium">{item.degree}</p>
                  <p className="text-sm text-muted-foreground">{item.institution}</p>
                  {item.year && <p className="text-xs text-muted-foreground mt-1">{item.year}</p>}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No education added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
