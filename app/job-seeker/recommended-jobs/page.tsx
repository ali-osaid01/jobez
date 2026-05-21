'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetRecommendedJobsQuery, useToggleBookmarkMutation } from '@/lib/store';
import type { JobResponseData } from '@/lib/store/types';
import {
  Search,
  MapPin,
  Banknote,
  Briefcase,
  Building2,
  Clock,
  BookmarkPlus,
  BookmarkCheck,
  ExternalLink,
  Zap,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { toast } from 'sonner';

export default function RecommendedJobsPage() {
  const { data: recommendedJobs = [], isLoading, isError, refetch } = useGetRecommendedJobsQuery();
  const [toggleBookmark] = useToggleBookmarkMutation();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const headerRef = useScrollAnimation({ threshold: 0.1 });

  const handleToggleBookmark = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await toggleBookmark(jobId).unwrap();
      setBookmarkedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(jobId)) {
          newSet.delete(jobId);
          toast.success('Removed from bookmarks');
        } else {
          newSet.add(jobId);
          toast.success('Added to bookmarks');
        }
        return newSet;
      });
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div ref={headerRef} className="mb-8 animate-fade-in-up">
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

      {/* Loading State */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
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
        /* Error State */
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">Recommendations unavailable</h3>
            <p className="text-muted-foreground mb-6">
              The recommendation service is currently unavailable. Please try again later.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      ) : recommendedJobs.length === 0 ? (
        /* Empty State */
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedJobs.map((job: JobResponseData) => (
            <Link key={job.id} href={`/job-seeker/jobs/${job.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="pt-6 space-y-4">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                      <button
                        onClick={(e) => handleToggleBookmark(job.id, e)}
                        className="p-1 hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        {bookmarkedIds.has(job.id) ? (
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

                  {/* Details */}
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

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {job.experienceLevel && (
                      <Badge variant="secondary">{job.experienceLevel}</Badge>
                    )}
                    {job.createdAt && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.floor(
                          (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                        )}d ago
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  {job.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>
                  )}

                  {/* CTA */}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
