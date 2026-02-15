'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockApplications } from '@/lib/mock-data';
import { FileText, Calendar, Building2, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsPage() {
  const [applications] = useState(mockApplications);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FileText className="h-4 w-4" />;
      case 'shortlisted': return <TrendingUp className="h-4 w-4" />;
      case 'interview-scheduled': return <Calendar className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filterByStatus = (status: string | null) => {
    if (!status) return applications;
    return applications.filter(app => app.status === status);
  };

  const ApplicationCard = ({ application }: { application: typeof applications[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getStatusIcon(application.status)}
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{application.jobTitle}</CardTitle>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Building2 className="h-4 w-4" />
                  {application.company}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Applied {application.appliedDate}
              </span>
              {application.matchScore && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  {application.matchScore}% match
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Badge className={`${getStatusColor(application.status)} justify-center`}>
              {application.status.replace('-', ' ').toUpperCase()}
            </Badge>
            <Link href={`/job-seeker/jobs/${application.jobId}`}>
              <Button variant="outline" size="sm" className="w-full">
                View Job
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          My Applications
        </h1>
        <p className="text-muted-foreground mt-2">
          Track and manage your job applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Total</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{applications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {filterByStatus('pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {filterByStatus('shortlisted').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Interviews</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {filterByStatus('interview-scheduled').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List with Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterByStatus('pending').length})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({filterByStatus('shortlisted').length})</TabsTrigger>
          <TabsTrigger value="interview">Interviews ({filterByStatus('interview-scheduled').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {applications.map(app => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterByStatus('pending').length > 0 ? (
            filterByStatus('pending').map(app => (
              <ApplicationCard key={app.id} application={app} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No pending applications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="shortlisted" className="space-y-4">
          {filterByStatus('shortlisted').length > 0 ? (
            filterByStatus('shortlisted').map(app => (
              <ApplicationCard key={app.id} application={app} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No shortlisted applications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          {filterByStatus('interview-scheduled').length > 0 ? (
            filterByStatus('interview-scheduled').map(app => (
              <ApplicationCard key={app.id} application={app} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No scheduled interviews</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
