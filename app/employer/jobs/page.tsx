'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetJobsQuery, useAppSelector, selectCurrentUser } from '@/lib/store';
import { Briefcase, Users, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function EmployerJobsPage() {
  const user = useAppSelector(selectCurrentUser);
  const { data: jobsData, isLoading, isError } = useGetJobsQuery(
    user ? { employerId: user.id } : undefined,
    { skip: !user },
  );
  const jobs = jobsData?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Failed to load jobs</h2>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-secondary" />
            My Job Postings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your active and closed job listings
          </p>
        </div>
        <Link href="/employer/jobs/new">
          <Button className="gap-2 bg-secondary hover:bg-secondary/90">
            <PlusCircle className="h-5 w-5" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm text-muted-foreground">Active Jobs</p>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {jobs.filter((j) => j.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm text-muted-foreground">Total Applicants</p>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {jobs.reduce((sum, job) => sum + (job.applicantsCount || 0), 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="font-semibold mb-2">No job postings yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first job posting to start attracting talent
              </p>
              <Link href="/employer/jobs/new">
                <Button className="bg-secondary hover:bg-secondary/90">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Briefcase className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">Posted on {job.postedDate}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.applicantsCount || 0} applicants
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge variant="secondary">{job.locationType}</Badge>
                      <Badge variant="secondary">{job.experienceLevel}</Badge>
                      <Badge className={
                        job.status === 'active'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      }>
                        {job.status === 'active' ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:w-48">
                    <Link href={`/employer/jobs/${job.id}`}>
                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/employer/applicants?jobId=${job.id}`}>
                      <Button className="w-full bg-secondary hover:bg-secondary/90">
                        View Applicants ({job.applicantsCount || 0})
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
