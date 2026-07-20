'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetApplicationsQuery } from '@/lib/store';
import type { ApplicationResponseData, ApplicationStatus } from '@/lib/store/types';
import { PaginationControls } from '@/components/pagination-controls';
import {
  FileText, Calendar, Building2, TrendingUp,
  Clock, AlertCircle, RefreshCw, Briefcase,
} from 'lucide-react';
import Link from 'next/link';

const PAGE_SIZE = 10;
type ApplicationTab = 'all' | ApplicationStatus;

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function statusColor(status: string): string {
  switch (status) {
    case 'pending':              return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'shortlisted':         return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'interview-scheduled': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'rejected':            return 'bg-red-100 text-red-800 border-red-300';
    case 'hired':               return 'bg-green-100 text-green-800 border-green-300';
    default:                    return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

function statusLabel(status: string): string {
  return status.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function applicationDisplayStatus(app: ApplicationResponseData) {
  if (app.latestInterviewStatus === 'completed' && app.latestInterviewScore === 0) {
    return {
      label: 'Interview Failed - Score 0',
      className: 'bg-red-100 text-red-800 border-red-300',
    };
  }
  if (app.latestInterviewStatus === 'completed') {
    return {
      label: 'Interview Completed - Under Review',
      className: 'bg-green-100 text-green-800 border-green-300',
    };
  }
  return {
    label: statusLabel(app.status),
    className: statusColor(app.status),
  };
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'shortlisted':         return <TrendingUp className="h-4 w-4" />;
    case 'interview-scheduled': return <Calendar className="h-4 w-4" />;
    default:                    return <FileText className="h-4 w-4" />;
  }
}

// ─── Application Card ─────────────────────────────────────────

function ApplicationCard({ app }: { app: ApplicationResponseData }) {
  const displayStatus = applicationDisplayStatus(app);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <StatusIcon status={app.status} />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg leading-snug break-words">{app.jobTitle}</CardTitle>
                <p className="text-muted-foreground flex items-center gap-1.5 mt-1 text-sm">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 break-words">{app.company}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0" />
                Applied {formatDate(app.appliedDate)}
              </span>
              {app.matchScore !== null && app.matchScore !== undefined && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  {app.matchScore}% match
                </Badge>
              )}
            </div>

            {app.rejectionReason && (
              <p className="text-sm text-muted-foreground italic border-l-2 border-destructive/30 pl-3">
                {app.rejectionReason}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 md:w-44 shrink-0">
            <Badge className={`${displayStatus.className} justify-center py-1`}>
              {displayStatus.label}
            </Badge>
            {app.latestInterviewStatus === 'completed' && app.latestInterviewId && (
              <Link href={`/job-seeker/interviews/${app.latestInterviewId}/results`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Results
                </Button>
              </Link>
            )}
            <Link href={`/job-seeker/jobs/${app.jobId}`}>
              <Button variant="outline" size="sm" className="w-full">
                View Job
              </Button>
            </Link>
          </div>

        </div>
      </CardHeader>
    </Card>
  );
}

// ─── Empty state ──────────────────────────────────────────────

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
        <p className="text-muted-foreground">{message}</p>
        <Link href="/job-seeker/all-jobs">
          <Button size="sm" className="mt-4">Browse Jobs</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ─── Loading skeletons ────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex gap-4">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2 w-32">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<ApplicationTab>('all');
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useGetApplicationsQuery({
    page,
    limit: PAGE_SIZE,
    status: activeTab === 'all' ? null : activeTab,
  });

  const applications: ApplicationResponseData[] = data?.data ?? [];
  const counts = data?.counts;
  const totalApplications = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const handleTabChange = (value: string) => {
    setActiveTab(value as ApplicationTab);
    setPage(1);
  };

  const renderApplications = (emptyIcon: React.ElementType, emptyMessage: string) => {
    if (isLoading || isFetching) return <LoadingSkeleton />;
    if (applications.length === 0) return <EmptyState icon={emptyIcon} message={emptyMessage} />;
    return applications.map((app) => <ApplicationCard key={app.id} app={app} />);
  };

  // ── Error ──────────────────────────────────────────────────

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          My Applications
        </h1>
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="font-medium">Could not load your applications</p>
            <p className="text-sm text-muted-foreground">Check your connection or try again.</p>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────

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
        {[
          { label: 'Total',        value: counts?.total,               icon: FileText,    color: 'text-muted-foreground' },
          { label: 'Pending',      value: counts?.pending,             icon: Clock,       color: 'text-yellow-600' },
          { label: 'Shortlisted',  value: counts?.shortlisted,         icon: TrendingUp,  color: 'text-blue-600' },
          { label: 'Interviews',   value: counts?.interviewScheduled,  icon: Calendar,    color: 'text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All {!isLoading && counts !== undefined && `(${counts?.total ?? 0})`}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending {!isLoading && counts !== undefined && `(${counts?.pending ?? 0})`}
          </TabsTrigger>
          <TabsTrigger value="shortlisted">
            Shortlisted {!isLoading && counts !== undefined && `(${counts?.shortlisted ?? 0})`}
          </TabsTrigger>
          <TabsTrigger value="interview-scheduled">
            Interviews {!isLoading && counts !== undefined && `(${counts?.interviewScheduled ?? 0})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderApplications(Briefcase, "You haven't applied to any jobs yet")}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {renderApplications(FileText, 'No pending applications')}
        </TabsContent>

        <TabsContent value="shortlisted" className="space-y-4">
          {renderApplications(TrendingUp, 'No shortlisted applications')}
        </TabsContent>

        <TabsContent value="interview-scheduled" className="space-y-4">
          {renderApplications(Calendar, 'No scheduled interviews')}
        </TabsContent>

      </Tabs>

      {applications.length > 0 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          totalItems={totalApplications}
          pageSize={PAGE_SIZE}
          itemLabel="application"
          isLoading={isFetching}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
