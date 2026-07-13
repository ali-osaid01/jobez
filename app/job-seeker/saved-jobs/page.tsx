'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookmarkCheck, Briefcase, Building2, ExternalLink, MapPin, Banknote, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { PaginationControls } from '@/components/pagination-controls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSavedJobsQuery, useToggleBookmarkMutation } from '@/lib/store';
import type { JobResponseData } from '@/lib/store/types';

const PAGE_SIZE = 10;

function LoadingSkeleton() {
  return (
    <div className="grid gap-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex gap-2 lg:flex-col">
                <Skeleton className="h-10 w-28 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptySavedJobs() {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BookmarkCheck className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No saved jobs yet</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Save jobs while browsing, then come back here to review them.
        </p>
        <Link href="/job-seeker/all-jobs">
          <Button>Browse Jobs</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function SavedJobCard({
  job,
  isRemoving,
  onRemove,
}: {
  job: JobResponseData;
  isRemoving: boolean;
  onRemove: (jobId: string) => void;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <Link href={`/job-seeker/jobs/${job.id}`}>
                <h3 className="text-xl font-heading font-semibold transition-colors hover:text-primary">
                  {job.title}
                </h3>
              </Link>
              <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {job.company}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Banknote className="h-4 w-4" />
                {job.salary}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {job.postedDate}
              </span>
            </div>

            <p className="line-clamp-2 text-sm text-muted-foreground">{job.description}</p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-normal">{job.type}</Badge>
              <Badge variant="secondary" className="font-normal">{job.locationType}</Badge>
              <Badge variant="secondary" className="font-normal">{job.experienceLevel}</Badge>
              {typeof job.matchScore === 'number' && (
                <Badge variant="outline" className="font-normal">{job.matchScore}% match</Badge>
              )}
              <Badge variant={job.status === 'active' ? 'outline' : 'secondary'} className="font-normal">
                {job.status}
              </Badge>
            </div>
          </div>

          <div className="flex justify-between gap-2 lg:flex-col lg:items-end lg:justify-start">
            <Link href={`/job-seeker/jobs/${job.id}`} className="flex-1 lg:flex-initial">
              <Button className="w-full gap-2">
                View Job
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="gap-2"
              disabled={isRemoving}
              onClick={() => onRemove(job.id)}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SavedJobsPage() {
  const [page, setPage] = useState(1);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { data, isLoading, isFetching, isError, refetch } = useGetSavedJobsQuery({
    page,
    limit: PAGE_SIZE,
  });
  const [toggleBookmark] = useToggleBookmarkMutation();

  const jobs = data?.data ?? [];
  const totalJobs = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;
  const showLoading = (isLoading || isFetching) && jobs.length === 0;

  const handleRemove = async (jobId: string) => {
    try {
      setRemovingId(jobId);
      await toggleBookmark(jobId).unwrap();
      toast.success('Removed from saved jobs');
    } catch {
      toast.error('Failed to remove saved job');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-heading font-bold">
          <BookmarkCheck className="h-8 w-8 text-primary" />
          Saved Jobs
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review the jobs you saved while searching.
        </p>
      </div>

      {showLoading ? (
        <LoadingSkeleton />
      ) : isError && jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground opacity-20" />
            <div>
              <h3 className="mb-2 font-semibold">Could not load saved jobs</h3>
              <p className="text-sm text-muted-foreground">Check your connection or try again.</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : jobs.length === 0 ? (
        <EmptySavedJobs />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{jobs.length}</span> of{' '}
            <span className="font-medium text-foreground">{totalJobs}</span> saved jobs
          </p>

          <div className="grid gap-4">
            {jobs.map((job) => (
              <SavedJobCard
                key={job.id}
                job={job}
                isRemoving={removingId === job.id}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalItems={totalJobs}
            pageSize={PAGE_SIZE}
            itemLabel="saved job"
            isLoading={isFetching}
            onPageChange={setPage}
            className="pt-4"
          />
        </div>
      )}
    </div>
  );
}
