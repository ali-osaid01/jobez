'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockJobs } from '@/lib/mock-data';
import { Search, MapPin, DollarSign, Briefcase, Building2, Clock, BookmarkPlus, ExternalLink, Filter, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export default function AllJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const headerRef = useScrollAnimation({ threshold: 0.1 });
  const filtersRef = useScrollAnimation({ threshold: 0.1 });

  // Expanded mock data with more jobs
  const allJobs = [
    ...mockJobs,
    {
      id: '4',
      title: 'Backend Engineer',
      company: 'Arbisoft',
      location: 'Lahore, Pakistan',
      locationType: 'Remote',
      salary: '200,000 - 350,000 PKR',
      type: 'Full-time',
      experienceLevel: 'Mid',
      description: 'Build scalable backend services and APIs for our growing platform.',
      postedDate: '2 days ago',
      applicantsCount: 42
    },
    {
      id: '5',
      title: 'Marketing Manager',
      company: 'Daraz Pakistan',
      location: 'Karachi, Pakistan',
      locationType: 'Hybrid',
      salary: '150,000 - 250,000 PKR',
      type: 'Full-time',
      experienceLevel: 'Senior',
      description: 'Lead our marketing initiatives and drive customer acquisition strategies.',
      postedDate: '3 days ago',
      applicantsCount: 28
    },
    {
      id: '6',
      title: 'Data Scientist',
      company: 'i2c Inc.',
      location: 'Lahore, Pakistan',
      locationType: 'On-site',
      salary: '300,000 - 500,000 PKR',
      type: 'Full-time',
      experienceLevel: 'Senior',
      description: 'Apply machine learning and statistical analysis to solve business problems.',
      postedDate: '1 week ago',
      applicantsCount: 56
    },
    {
      id: '7',
      title: 'UI/UX Designer',
      company: 'VentureDive',
      location: 'Islamabad, Pakistan',
      locationType: 'Remote',
      salary: '120,000 - 200,000 PKR',
      type: 'Full-time',
      experienceLevel: 'Mid',
      description: 'Design intuitive and beautiful user interfaces for web and mobile applications.',
      postedDate: '4 days ago',
      applicantsCount: 35
    },
    {
      id: '8',
      title: 'DevOps Engineer',
      company: 'Folio3',
      location: 'Karachi, Pakistan',
      locationType: 'Hybrid',
      salary: '250,000 - 400,000 PKR',
      type: 'Full-time',
      experienceLevel: 'Senior',
      description: 'Manage and optimize our cloud infrastructure and deployment pipelines.',
      postedDate: '5 days ago',
      applicantsCount: 22
    }
  ];

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || job.locationType === locationFilter;
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    const matchesExperience = experienceFilter === 'all' || job.experienceLevel === experienceFilter;

    return matchesSearch && matchesLocation && matchesType && matchesExperience;
  });

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
          <div className="space-y-4">
            {/* Main Search */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by job title, company, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base focus-ring-smooth"
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2 h-12 hover-lift"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              <Button className="gap-2 h-12 btn-press">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location Type</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
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
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
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
                  <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Entry">Entry Level</SelectItem>
                      <SelectItem value="Mid">Mid Level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs
        </p>
        <Button variant="ghost" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Sort by: Relevance
        </Button>
      </div>

      {/* Job Listings Grid */}
      <div className="grid gap-4">
        {filteredJobs.map((job, index) => (
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
                      <DollarSign className="h-4 w-4" />
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
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
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
              onClick={() => {
                setSearchQuery('');
                setLocationFilter('all');
                setTypeFilter('all');
                setExperienceFilter('all');
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {filteredJobs.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" size="lg" className="hover-scale btn-press">
            Load More Jobs
          </Button>
        </div>
      )}
    </div>
  );
}
