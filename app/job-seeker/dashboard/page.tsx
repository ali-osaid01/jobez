'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/auth';
import { mockJobs, mockApplications, mockInterviews } from '@/lib/mock-data';
import { 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Banknote,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function JobSeekerDashboard() {
  const user = auth.getUser();
  const recentApplications = mockApplications.slice(0, 3);
  const upcomingInterviews = mockInterviews.filter(i => i.status === 'scheduled').slice(0, 2);
  const recommendedJobs = mockJobs.slice(0, 3);

  const stats = [
    {
      title: 'Applications',
      value: mockApplications.length,
      icon: Briefcase,
      description: 'Total applied',
      color: 'text-blue-600'
    },
    {
      title: 'Interviews',
      value: upcomingInterviews.length,
      icon: Calendar,
      description: 'Scheduled',
      color: 'text-purple-600'
    },
    {
      title: 'Profile Views',
      value: 48,
      icon: TrendingUp,
      description: 'This month',
      color: 'text-green-600'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'interview-scheduled': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'hired': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your job search today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Interviews
                </CardTitle>
                <CardDescription>Your scheduled interviews</CardDescription>
              </div>
              <Link href="/job-seeker/interviews">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold">{interview.jobTitle}</h4>
                    <p className="text-sm text-muted-foreground">{interview.company}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {interview.scheduledDate} at {interview.scheduledTime}
                      </span>
                      <Badge variant="secondary">{interview.type === 'ai' ? 'AI Interview' : 'Human Interview'}</Badge>
                    </div>
                  </div>
                  <Link href={`/job-seeker/interviews/${interview.id}`}>
                    <Button size="sm">Join</Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No upcoming interviews</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Recent Applications
                </CardTitle>
                <CardDescription>Track your job applications</CardDescription>
              </div>
              <Link href="/job-seeker/applications">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-start justify-between p-4 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <h4 className="font-semibold">{application.jobTitle}</h4>
                  <p className="text-sm text-muted-foreground">{application.company}</p>
                  <p className="text-xs text-muted-foreground">Applied {application.appliedDate}</p>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {application.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Jobs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Recommended for You
              </CardTitle>
              <CardDescription>AI-matched jobs based on your profile</CardDescription>
            </div>
            <Link href="/job-seeker/jobs">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedJobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{job.title}</h4>
                  {job.matchScore && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 shrink-0">
                      {job.matchScore}% match
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Banknote className="h-3 w-3" />
                    {job.salary}
                  </span>
                  <Badge variant="outline" className="text-xs">{job.type}</Badge>
                  <Badge variant="outline" className="text-xs">{job.locationType}</Badge>
                </div>
              </div>
              <Link href={`/job-seeker/jobs/${job.id}`} className="shrink-0">
                <Button>View Details</Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
