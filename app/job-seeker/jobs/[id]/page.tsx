'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useApplyForJobMutation, useGetApplicationsQuery, useGetJobByIdQuery, useToggleBookmarkMutation } from '@/lib/store';
import {
  MapPin,
  Banknote,
  Briefcase,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data: job, isLoading, isError } = useGetJobByIdQuery(jobId);
  const { data: applicationsData, isLoading: applicationsLoading } = useGetApplicationsQuery({
    jobId,
    limit: 1,
  });
  const [toggleBookmark] = useToggleBookmarkMutation();
  const [applyForJob, { isLoading: applying }] = useApplyForJobMutation();
  const [applied, setApplied] = useState(false);

  const getApiErrorMessage = (err: unknown): string => {
    const maybeError = err as {
      data?: {
        error?: { message?: string };
        detail?: string;
        message?: string;
      } | string;
      error?: string;
    };

    if (typeof maybeError?.data === 'string' && maybeError.data.trim()) {
      return maybeError.data;
    }

    if (maybeError?.data && typeof maybeError.data === 'object') {
      return (
        maybeError.data.error?.message ||
        maybeError.data.detail ||
        maybeError.data.message ||
        'Failed to submit application'
      );
    }

    if (maybeError?.error) {
      return maybeError.error;
    }

    return 'Failed to submit application';
  };

  const alreadyApplied = Boolean(
    applicationsData?.data?.some((application) => application.jobId === jobId),
  );
  const isCheckingApplication = applicationsLoading && !applicationsData;

  const handleApply = async () => {
    try {
      await applyForJob(jobId).unwrap();
      setApplied(true);
      toast.success('Application submitted successfully!');
      setTimeout(() => {
        router.push('/job-seeker/applications');
      }, 2000);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleSaveJob = async () => {
    try {
      const result = await toggleBookmark(jobId).unwrap();
      toast.success(result.bookmarked ? 'Job saved to bookmarks' : 'Bookmark removed');
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Job not found</h2>
        <Link href="/job-seeker/jobs">
          <Button variant="link">Back to jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/job-seeker/jobs">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Button>
      </Link>

      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-4 flex-1">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-heading font-bold">{job.title}</h1>
                  <p className="text-xl text-muted-foreground flex items-center gap-2 mt-1">
                    <Building2 className="h-5 w-5" />
                    {job.company}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Banknote className="h-4 w-4" />
                  {job.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {job.postedDate}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">{job.type}</Badge>
                <Badge variant="secondary" className="text-sm">{job.locationType}</Badge>
                <Badge variant="secondary" className="text-sm">{job.experienceLevel} Level</Badge>
                {job.matchScore && (
                  <Badge className="bg-green-100 text-green-800 border-green-300 text-sm">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {job.matchScore}% match
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 md:w-48">
              {isCheckingApplication ? (
                <div className="text-center p-4 bg-muted/40 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Checking application status...</p>
                </div>
              ) : alreadyApplied || applied ? (
                <div className="text-center p-4 bg-muted/40 border rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">You have already applied to this job</p>
                </div>
              ) : (
                <>
                  <Button size="lg" onClick={handleApply} className="w-full" disabled={applying}>
                    {applying ? 'Applying...' : 'Apply Now'}
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={handleSaveJob}>
                    Save Job
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Job Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{job.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{resp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>About {job.company}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job Type</span>
                  <span className="font-medium">{job.locationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applicants</span>
                  <span className="font-medium">{job.applicantsCount || 0}</span>
                </div>
                {job.applicationDeadline && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-medium">{job.applicationDeadline}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Match Insights */}
          {job.matchScore && job.matchScore > 80 && (
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  AI Match Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  This role is a great match for your profile!
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Strong skills alignment</li>
                  <li>• Experience level match</li>
                  <li>• Location preference fit</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
