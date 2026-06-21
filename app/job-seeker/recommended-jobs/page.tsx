'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationControls } from '@/components/pagination-controls';
import { useGetRecommendedJobsQuery, useToggleBookmarkMutation } from '@/lib/store';
import type { JobResponseData } from '@/lib/store/types';
import {
  AlertCircle,
  Banknote,
  BookmarkCheck,
  BookmarkPlus,
  Briefcase,
  Building2,
  Clock,
  ExternalLink,
  MapPin,
  RefreshCw,
  Search,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { toast } from 'sonner';

const PAGE_SIZE = 12;

export default function RecommendedJobsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useGetRecommendedJobsQuery({
    page,
    limit: PAGE_SIZE,
  });
  const [toggleBookmark] = useToggleBookmarkMutation();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const headerRef = useScrollAnimation({ threshold: 0.1 });
  const recommendedJobs: JobResponseData[] = data?.data ?? [];
  const totalJobs = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const handleToggleBookmark = async (jobId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const result = await toggleBookmark(jobId).unwrap();
      setBookmarkedIds((previousIds) => {
        const nextIds = new Set(previousIds);
        if (result.bookmarked) {
          nextIds.add(jobId);
          toast.success('Added to bookmarks');
        } else {
          nextIds.delete(jobId);
          toast.success('Removed from bookmarks');
        }
        return nextIds;
      });
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div ref={headerRef.ref} className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">AI-Recommended Jobs</h1>
            <p className="text-muted-foreground">Jobs matched to your profile using AI embeddings</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Failed to load recommendations</h3>
              <p className="text-sm text-muted-foreground">Please try again or refresh your recommendations.</p>
            </div>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : recommendedJobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">No recommendations yet</h3>
            <p className="text-muted-foreground mb-6">
              Complete your profile to get personalized job recommendations based on AI embeddings
            </p>
            <Link href="/job-seeker/profile">
              <Button>Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedJobs.map((job) => {
              const postedDate = job.createdAt || job.postedDate;
              const isBookmarked = bookmarkedIds.has(job.id) || job.isBooked;

              return (
                <Card key={job.id} className="h-full hover:shadow-lg transition-shadow group">
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link href={`/job-seeker/jobs/${job.id}`}>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {job.title}
                          </h3>
                        </Link>
                        <button
                          onClick={(event) => handleToggleBookmark(job.id, event)}
                          className="p-1 hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="h-5 w-5 text-primary fill-current" />
                          ) : (
                            <BookmarkPlus className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      {job.location && (
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {job.location} • {job.locationType}
                        </p>
                      )}
                      {job.salary && (
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Banknote className="h-4 w-4" />
                          {job.salary}
                        </p>
                      )}
                      {job.type && (
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          {job.type}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.experienceLevel && (
                        <Badge variant="secondary">{job.experienceLevel}</Badge>
                      )}
                      {postedDate && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.floor((Date.now() - new Date(postedDate).getTime()) / (1000 * 60 * 60 * 24))}d ago
                        </Badge>
                      )}
                    </div>

                    {job.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    <div className="pt-2 border-t flex gap-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/job-seeker/jobs/${job.id}`}>
                          View Details
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalItems={totalJobs}
            pageSize={PAGE_SIZE}
            itemLabel="recommendation"
            isLoading={isFetching}
            onPageChange={setPage}
            className="mt-6"
          />
        </>
      )}
    </div>
  );
}
