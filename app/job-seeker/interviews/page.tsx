'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaginationControls } from '@/components/pagination-controls';
import { useGetInterviewsQuery } from '@/lib/store';
import type { InterviewResponseData, InterviewStatus } from '@/lib/store/types';
import { AlertCircle, Calendar, CheckCircle2, Clock, RefreshCw, Sparkles, Video, XCircle } from 'lucide-react';
import Link from 'next/link';

const PAGE_SIZE = 10;

function getStatusColor(status: InterviewStatus) {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'completed': return 'bg-green-100 text-green-800 border-green-300';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
    case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex gap-4">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-56" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, message }: { icon: React.ElementType; title: string; message: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

function InterviewCard({ interview }: { interview: InterviewResponseData }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${interview.type === 'ai' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                {interview.type === 'ai' ? (
                  <Sparkles className="h-5 w-5 text-primary" />
                ) : (
                  <Video className="h-5 w-5 text-secondary" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{interview.jobTitle}</CardTitle>
                <p className="text-muted-foreground mt-1">{interview.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {interview.scheduledDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {interview.scheduledTime} ({interview.duration} min)
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {interview.type === 'ai' ? 'AI Interview' : 'Human Interview'}
              </Badge>
              {interview.aiScore !== null && interview.aiScore > 0 && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  Score: {interview.aiScore}/100
                </Badge>
              )}
            </div>

            {interview.aiSummary && (
              <p className="text-sm text-muted-foreground italic">
                {interview.aiSummary}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Badge className={`${getStatusColor(interview.status)} justify-center`}>
              {interview.status.toUpperCase()}
            </Badge>
            {interview.status === 'scheduled' && (
              <Link href={`/job-seeker/interviews/${interview.id}`}>
                <Button className="w-full">
                  {interview.type === 'ai' ? 'Start AI Interview' : 'Join Meeting'}
                </Button>
              </Link>
            )}
            {interview.status === 'completed' && (
              <Link href={`/job-seeker/interviews/${interview.id}/results`}>
                <Button variant="outline" className="w-full">
                  View Results
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<InterviewStatus>('scheduled');
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useGetInterviewsQuery({
    page,
    limit: PAGE_SIZE,
    status: activeTab,
  });

  const interviews = data?.data ?? [];
  const counts = data?.counts;
  const totalInterviews = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;
  const avgScore = interviews.length > 0
    ? Math.round(interviews.reduce((sum, interview) => sum + (interview.aiScore || 0), 0) / interviews.length)
    : 0;

  const handleTabChange = (value: string) => {
    setActiveTab(value as InterviewStatus);
    setPage(1);
  };

  const renderInterviews = (emptyIcon: React.ElementType, title: string, message: string) => {
    if (isLoading || isFetching) return <LoadingSkeleton />;
    if (interviews.length === 0) return <EmptyState icon={emptyIcon} title={title} message={message} />;
    return interviews.map((interview) => <InterviewCard key={interview.id} interview={interview} />);
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          My Interviews
        </h1>
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="font-medium">Could not load interviews</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          My Interviews
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your scheduled and completed interviews
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Scheduled
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{counts?.scheduled ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{counts?.completed ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Current Page Avg AI Score
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{avgScore}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="scheduled">
            Scheduled ({counts?.scheduled ?? 0})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({counts?.completed ?? 0})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({counts?.cancelled ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          {renderInterviews(Calendar, 'No scheduled interviews', 'Your upcoming interviews will appear here')}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {renderInterviews(CheckCircle2, 'No completed interviews', 'Your interview history will appear here')}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {renderInterviews(XCircle, 'No cancelled interviews', 'Cancelled interviews will appear here')}
        </TabsContent>
      </Tabs>

      {interviews.length > 0 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          totalItems={totalInterviews}
          pageSize={PAGE_SIZE}
          itemLabel="interview"
          isLoading={isFetching}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
