'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { mockApplications } from '@/lib/mock-data';
import { useAppSelector, selectCurrentUser, useGetJobsQuery } from '@/lib/store';
import {
  Briefcase,
  Users,
  UserCheck,
  ArrowRight,
  PlusCircle,
  Phone,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function EmployerDashboard() {
  const user = useAppSelector(selectCurrentUser);

  const { data: jobsData, isLoading: jobsLoading, isError: jobsError } = useGetJobsQuery(
    user ? { employerId: user.id } : undefined,
    { skip: !user },
  );

  // Filter to active jobs and cap at 4 for the dashboard card
  const allJobs     = jobsData?.data ?? [];
  const activeJobs  = allJobs.filter((j) => j.status === 'active');
  const dashboardJobs = activeJobs.slice(0, 4);
  const totalApplicants = allJobs.reduce((sum, j) => sum + (j.applicantsCount ?? 0), 0);

  const recentApplicants = mockApplications.slice(0, 3);

  const stats = [
    {
      title: 'Active Jobs',
      value: jobsLoading ? '—' : activeJobs.length,
      icon: Briefcase,
      description: 'Currently posted',
      color: 'text-blue-600',
    },
    {
      title: 'Total Applicants',
      value: jobsLoading ? '—' : totalApplicants,
      icon: Users,
      description: 'Across all jobs',
      color: 'text-purple-600',
    },
    {
      title: 'Shortlisted',
      value: 12,
      icon: UserCheck,
      description: 'Ready to contact',
      color: 'text-green-600',
    },
    {
      title: 'Contacted',
      value: 8,
      icon: Phone,
      description: 'In progress',
      color: 'text-orange-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'shortlisted':return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'contacted':  return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'rejected':   return 'bg-red-100 text-red-800 border-red-300';
      case 'hired':      return 'bg-green-100 text-green-800 border-green-300';
      default:           return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold">
            Welcome back{user?.company ? `, ${user.company}` : ''}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your recruitment activity
          </p>
        </div>
        <Link href="/employer/jobs/new">
          <Button size="lg" className="gap-2 bg-secondary hover:bg-secondary/90">
            <PlusCircle className="h-5 w-5" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {jobsLoading && (stat.title === 'Active Jobs' || stat.title === 'Total Applicants') ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Active Job Postings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-secondary" />
                  Active Job Postings
                </CardTitle>
                <CardDescription>Your currently listed positions</CardDescription>
              </div>
              <Link href="/employer/jobs">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Loading */}
            {jobsLoading && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                    <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </>
            )}

            {/* Error */}
            {!jobsLoading && jobsError && (
              <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
                <AlertCircle className="h-6 w-6 text-destructive" />
                Failed to load jobs
              </div>
            )}

            {/* Empty */}
            {!jobsLoading && !jobsError && dashboardJobs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No active job postings</p>
                <Link href="/employer/jobs/new">
                  <Button size="sm" className="mt-3 bg-secondary hover:bg-secondary/90">
                    Post a Job
                  </Button>
                </Link>
              </div>
            )}

            {/* Jobs list */}
            {!jobsLoading && !jobsError && dashboardJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
                  <Briefcase className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h4 className="font-semibold truncate">{job.title}</h4>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {job.applicantsCount ?? 0} applicants
                    </span>
                    <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                    <Badge variant="secondary" className="text-xs">{job.locationType}</Badge>
                  </div>
                </div>
                <Link href={`/employer/jobs/${job.id}`}>
                  <Button size="sm" variant="outline" className="shrink-0">
                    Manage
                  </Button>
                </Link>
              </div>
            ))}

          </CardContent>
        </Card>

        {/* Recent Applicants */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  Recent Applicants
                </CardTitle>
                <CardDescription>New candidates to review</CardDescription>
              </div>
              <Link href="/employer/applicants">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplicants.map((applicant) => (
              <div
                key={applicant.id}
                className="flex items-start justify-between p-4 rounded-lg border bg-card"
              >
                <div className="space-y-1.5">
                  <div>
                    <h4 className="font-semibold">{applicant.applicantName}</h4>
                    <p className="text-sm text-muted-foreground">{applicant.jobTitle}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Applied {applicant.appliedDate}</span>
                    {applicant.matchScore && (
                      <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                        {applicant.matchScore}% match
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(applicant.status)}>
                  {applicant.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
