'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetApplicationsQuery } from '@/lib/store';
import type { ApplicationResponseData } from '@/lib/store/types';
import {
  FileText, Calendar, Building2, TrendingUp,
  Clock, AlertCircle, RefreshCw, Briefcase,
} from 'lucide-react';
import Link from 'next/link';

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

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'shortlisted':         return <TrendingUp className="h-4 w-4" />;
    case 'interview-scheduled': return <Calendar className="h-4 w-4" />;
    default:                    return <FileText className="h-4 w-4" />;
  }
}

// ─── Application Card ─────────────────────────────────────────

function ApplicationCard({ app }: { app: ApplicationResponseData }) {
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
                <CardTitle className="text-lg leading-snug">{app.jobTitle}</CardTitle>
                <p className="text-muted-foreground flex items-center gap-1.5 mt-1 text-sm">
                  <Building2 className="h-4 w-4 shrink-0" />
                  {app.company}
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

          <div className="flex flex-col gap-2 md:w-36 shrink-0">
            <Badge className={`${statusColor(app.status)} justify-center py-1`}>
              {statusLabel(app.status)}
            </Badge>
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
  const { data, isLoading, isError, refetch } = useGetApplicationsQuery();

  const applications: ApplicationResponseData[] = data?.data ?? [];

  const byStatus = (status: string) => applications.filter((a) => a.status === status);
  const pending     = byStatus('pending');
  const shortlisted = byStatus('shortlisted');
  const interviews  = byStatus('interview-scheduled');

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
          { label: 'Total',        value: applications.length,  icon: FileText,    color: 'text-muted-foreground' },
          { label: 'Pending',      value: pending.length,       icon: Clock,       color: 'text-yellow-600' },
          { label: 'Shortlisted',  value: shortlisted.length,   icon: TrendingUp,  color: 'text-blue-600' },
          { label: 'Interviews',   value: interviews.length,    icon: Calendar,    color: 'text-purple-600' },
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
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All {!isLoading && `(${applications.length})`}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending {!isLoading && `(${pending.length})`}
          </TabsTrigger>
          <TabsTrigger value="shortlisted">
            Shortlisted {!isLoading && `(${shortlisted.length})`}
          </TabsTrigger>
          <TabsTrigger value="interview">
            Interviews {!isLoading && `(${interviews.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : applications.length === 0 ? (
            <EmptyState icon={Briefcase} message="You haven't applied to any jobs yet" />
          ) : (
            applications.map((app) => <ApplicationCard key={app.id} app={app} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : pending.length === 0 ? (
            <EmptyState icon={FileText} message="No pending applications" />
          ) : (
            pending.map((app) => <ApplicationCard key={app.id} app={app} />)
          )}
        </TabsContent>

        <TabsContent value="shortlisted" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : shortlisted.length === 0 ? (
            <EmptyState icon={TrendingUp} message="No shortlisted applications" />
          ) : (
            shortlisted.map((app) => <ApplicationCard key={app.id} app={app} />)
          )}
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : interviews.length === 0 ? (
            <EmptyState icon={Calendar} message="No scheduled interviews" />
          ) : (
            interviews.map((app) => <ApplicationCard key={app.id} app={app} />)
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}
