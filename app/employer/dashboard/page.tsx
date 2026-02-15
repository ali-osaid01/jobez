'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/auth';
import { mockJobs, mockApplications } from '@/lib/mock-data';
import {
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  UserCheck,
  ArrowRight,
  PlusCircle,
  Phone,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function EmployerDashboard() {
  const user = auth.getUser();
  const employerJobs = mockJobs.slice(0, 2);
  const recentApplicants = mockApplications.slice(0, 3);

  const stats = [
    {
      title: 'Active Jobs',
      value: employerJobs.length,
      icon: Briefcase,
      description: 'Currently posted',
      color: 'text-blue-600',
      change: '+2 this month'
    },
    {
      title: 'Total Applicants',
      value: 73,
      icon: Users,
      description: 'Across all jobs',
      color: 'text-purple-600',
      change: '+18 this week'
    },
    {
      title: 'Shortlisted',
      value: 12,
      icon: UserCheck,
      description: 'Ready to contact',
      color: 'text-green-600',
      change: '+5 this week'
    },
    {
      title: 'Contacted',
      value: 8,
      icon: Phone,
      description: 'In progress',
      color: 'text-orange-600',
      change: '+3 this week'
    },
  ];

  const pipelineStages = [
    { label: 'Applied', count: 73, color: 'bg-blue-500' },
    { label: 'AI Interview Done', count: 45, color: 'bg-purple-500' },
    { label: 'Shortlisted', count: 12, color: 'bg-yellow-500' },
    { label: 'Contacted', count: 8, color: 'bg-orange-500' },
    { label: 'Offer Sent', count: 3, color: 'bg-green-500' },
    { label: 'Hired', count: 2, color: 'bg-emerald-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'contacted': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'hired': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hiring Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            Hiring Pipeline Overview
          </CardTitle>
          <CardDescription>Track candidates through your hiring process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pipelineStages.map((stage) => (
              <div key={stage.label} className="text-center space-y-2">
                <div className={`mx-auto w-12 h-12 rounded-full ${stage.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {stage.count}
                </div>
                <p className="text-xs font-medium text-muted-foreground">{stage.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Jobs */}
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
            {employerJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold">{job.title}</h4>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {job.applicantsCount || 0} applicants
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      124 views
                    </span>
                    <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                  </div>
                </div>
                <Link href={`/employer/jobs/${job.id}`}>
                  <Button size="sm" variant="outline">Manage</Button>
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
                <div className="space-y-2">
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
