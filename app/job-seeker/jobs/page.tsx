'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetJobsQuery, useToggleBookmarkMutation } from '@/lib/store';
import { Search, MapPin, Banknote, Briefcase, Sparkles, Filter, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: jobsData, isLoading, isError } = useGetJobsQuery({
    page,
    limit: 20,
    ...(searchQuery ? { search: searchQuery } : {}),
  });
  const [toggleBookmark] = useToggleBookmarkMutation();

  const jobs = jobsData?.data ?? [];
  const totalPages = jobsData?.total_pages ?? 1;

  const handleBookmark = async (jobId: string) => {
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
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-16 w-full" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48" />
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
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Job Recommendations
        </h1>
        <p className="text-muted-foreground mt-2">
          AI-matched opportunities based on your skills and experience
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title, company, or location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {jobs.length} of {jobsData?.total ?? 0} job{(jobsData?.total ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="text-base">{job.company}</CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Banknote className="h-4 w-4" />
                      {job.salary}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Badge variant="secondary">{job.locationType}</Badge>
                    <Badge variant="secondary">{job.experienceLevel}</Badge>
                    {job.matchScore && (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        {job.matchScore}% match
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link href={`/job-seeker/jobs/${job.id}`}>
                    <Button className="w-full md:w-auto">View Details</Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto"
                    onClick={() => handleBookmark(job.id)}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Posted {job.postedDate}</span>
                {job.applicantsCount > 0 && (
                  <span>{job.applicantsCount} applicants</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="font-semibold mb-2">No jobs found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
