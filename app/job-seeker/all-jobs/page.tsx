'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetJobsQuery, useToggleBookmarkMutation } from '@/lib/store';
import type { JobExperienceLevel, JobLocationType, JobResponseData, JobType } from '@/lib/store/types';
import { Search, MapPin, Banknote, Briefcase, Building2, Clock, BookmarkPlus, ExternalLink, Filter, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { toast } from 'sonner';

export default function AllJobsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<JobLocationType | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<JobType | 'all'>('all');
  const [experienceFilter, setExperienceFilter] = useState<JobExperienceLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('active');
  const [sortBy, setSortBy] = useState<'postedDate' | 'salary'>('postedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<JobResponseData[]>([]);

  const queryParams = {
    page,
    limit: 12,
    ...(appliedSearch.trim() ? { search: appliedSearch.trim() } : {}),
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    ...(locationFilter !== 'all' ? { locationType: locationFilter } : {}),
    ...(typeFilter !== 'all' ? { type: typeFilter } : {}),
    ...(experienceFilter !== 'all' ? { experienceLevel: experienceFilter } : {}),
    sortBy,
    sortOrder,
  };

  const { data: jobsData, isLoading, isFetching, isError, refetch } = useGetJobsQuery(queryParams);
  const [toggleBookmark] = useToggleBookmarkMutation();

  const headerRef = useScrollAnimation({ threshold: 0.1 });
  const filtersRef = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    if (!jobsData) return;

    setJobs((previousJobs) => {
      if (page === 1 || previousJobs.length === 0) {
        return jobsData.data;
      }

      const seenIds = new Set(previousJobs.map((job) => job.id));
      return [...previousJobs, ...jobsData.data.filter((job) => !seenIds.has(job.id))];
    });
  }, [jobsData, page]);

  useEffect(() => {
    if (searchInput === '' && appliedSearch !== '') {
      setAppliedSearch('');
      setPage(1);
    }
  }, [searchInput, appliedSearch]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput.trim());
  };

  const handleFilterChange = <T,>(setter: (value: T) => void, value: T) => {
    setPage(1);
    setter(value);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setAppliedSearch('');
    setStatusFilter('active');
    setLocationFilter('all');
    setTypeFilter('all');
    setExperienceFilter('all');
    setSortBy('postedDate');
    setSortOrder('desc');
    setPage(1);
  };

  const handleBookmark = async (jobId: string) => {
    try {
      const result = await toggleBookmark(jobId).unwrap();
      toast.success(result.bookmarked ? 'Job saved to bookmarks' : 'Bookmark removed');
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  const totalJobs = jobsData?.total ?? jobs.length;
  const totalPages = jobsData?.total_pages ?? 1;
  const showLoadingSkeleton = isLoading && jobs.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        ref={headerRef.ref}
        className={`transition-all duration-700 ${headerRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <h1 className="text-3xl font-heading font-bold">All Jobs</h1>
        <p className="text-muted-foreground mt-2">
          Browse all available positions and find your perfect match
        </p>
      </div>

      {/* Search Bar */}
      <Card 
        ref={filtersRef.ref}
        className={`hover-lift transition-all duration-700 delay-100 ${filtersRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={handleSearch}>
            {/* Main Search */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by job title, company, or keywords..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 h-12 text-base focus-ring-smooth"
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2 h-12 hover-lift"
                type="button"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              <Button className="gap-2 h-12 btn-press" type="submit">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4 pt-4 border-t animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={(value) => handleFilterChange(setStatusFilter, value as 'all' | 'active' | 'closed')}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="all">All Statuses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location Type</label>
                  <Select value={locationFilter} onValueChange={(value) => handleFilterChange(setLocationFilter, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Type</label>
                  <Select value={typeFilter} onValueChange={(value) => handleFilterChange(setTypeFilter, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience Level</label>
                  <Select value={experienceFilter} onValueChange={(value) => handleFilterChange(setExperienceFilter, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Entry">Entry Level</SelectItem>
                      <SelectItem value="Mid">Mid Level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={(value) => handleFilterChange(setSortBy, value as 'postedDate' | 'salary')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Posted date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postedDate">Posted Date</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Order</label>
                  <Select value={sortOrder} onValueChange={(value) => handleFilterChange(setSortOrder, value as 'asc' | 'desc')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Newest first" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{jobs.length}</span> of{' '}
          <span className="font-semibold text-foreground">{totalJobs}</span> jobs
        </p>
        <Button variant="ghost" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Sort by: Relevance
        </Button>
      </div>

      {/* Job Listings Grid */}
      {showLoadingSkeleton ? (
        <div className="grid gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="hover-lift transition-all duration-500">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
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
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
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
      ) : isError && jobs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="font-semibold mb-2">Failed to load jobs</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Please try again or refresh the job list
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
        {jobs.map((job, index) => (
          <Card 
            key={job.id} 
            className={`hover-lift group transition-all duration-500 ${filtersRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ 
              transitionDelay: filtersRef.isVisible ? `${Math.min(index * 50, 400)}ms` : '0ms' 
            }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Company Logo Placeholder */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Job Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <Link href={`/job-seeker/jobs/${job.id}`}>
                      <h3 className="text-xl font-heading font-semibold hover:text-primary transition-colors group-hover:text-primary">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
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

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="font-normal">
                      {job.type}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      {job.locationType}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      {job.experienceLevel}
                    </Badge>
                    {typeof job.matchScore === 'number' && (
                      <Badge variant="outline" className="font-normal">
                        {job.matchScore}% match
                      </Badge>
                    )}
                    {job.applicantsCount && (
                      <Badge variant="outline" className="font-normal">
                        {job.applicantsCount} applicants
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 lg:items-end justify-between lg:justify-start">
                  <Link href={`/job-seeker/jobs/${job.id}`} className="flex-1 lg:flex-initial">
                    <Button className="w-full btn-press gap-2">
                      View Job
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover-lift"
                    onClick={() => handleBookmark(job.id)}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Empty State */}
      {!showLoadingSkeleton && jobs.length === 0 && !isError && (
        <Card className="animate-fade-in-up">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              variant="outline"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {jobs.length > 0 && page < totalPages && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            className="hover-scale btn-press"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={isFetching}
          >
            {isFetching && page > 1 ? 'Loading more...' : 'Load More Jobs'}
          </Button>
        </div>
      )}
    </div>
  );
}
