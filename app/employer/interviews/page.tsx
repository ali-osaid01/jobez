'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaginationControls } from '@/components/pagination-controls';
import { useGetInterviewsQuery, useUpdateApplicationStatusMutation } from '@/lib/store';
import type { InterviewResponseData, InterviewStatus } from '@/lib/store/types';
import { AlertCircle, Clock, MessageSquare, RefreshCw, Sparkles, Trophy, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;
type EmployerInterviewTab = Extract<InterviewStatus, 'completed' | 'scheduled'>;

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
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-56" />
              </div>
              <Skeleton className="h-9 w-36" />
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

export default function EmployerInterviewsPage() {
  const [activeTab, setActiveTab] = useState<EmployerInterviewTab>('completed');
  const [page, setPage] = useState(1);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const { data, isLoading, isFetching, isError, refetch } = useGetInterviewsQuery({
    page,
    limit: PAGE_SIZE,
    status: activeTab,
  });
  const [updateApplicationStatus, { isLoading: isUpdatingApplication }] = useUpdateApplicationStatusMutation();

  const interviews = data?.data ?? [];
  const counts = data?.counts;
  const totalInterviews = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const handleTabChange = (value: string) => {
    setActiveTab(value as EmployerInterviewTab);
    setPage(1);
  };

  const handleHire = async (interview: InterviewResponseData) => {
    try {
      await updateApplicationStatus({ id: interview.applicationId, body: { status: 'hired' } }).unwrap();
      toast.success(`${interview.applicantName || 'Candidate'} has been marked as hired`);
    } catch {
      toast.error('Failed to update candidate status');
    }
  };

  const handleReject = async (interview: InterviewResponseData) => {
    try {
      await updateApplicationStatus({
        id: interview.applicationId,
        body: { status: 'rejected', rejectionReason: rejectComment.trim() },
      }).unwrap();
      setRejectingId(null);
      setRejectComment('');
      toast.success(`${interview.applicantName || 'Candidate'} has been rejected`);
    } catch {
      toast.error('Failed to reject candidate');
    }
  };

  const InterviewCard = ({ interview }: { interview: InterviewResponseData }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{interview.applicantName || 'Candidate'}</CardTitle>
                <p className="text-muted-foreground mt-1">{interview.jobTitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {interview.scheduledDate} at {interview.scheduledTime}
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
              {interview.status === 'scheduled' && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  AWAITING RESPONSE
                </Badge>
              )}
              {interview.status === 'completed' && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  COMPLETED
                </Badge>
              )}
            </div>

            {interview.aiSummary && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Evaluation Summary
                </p>
                <p className="text-sm text-muted-foreground italic">
                  {interview.aiSummary}
                </p>
              </div>
            )}

            {rejectingId === interview.id && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Rejection reason (required):</p>
                <Textarea
                  placeholder="Please provide a reason for rejection..."
                  value={rejectComment}
                  onChange={(event) => setRejectComment(event.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!rejectComment.trim() || isUpdatingApplication}
                    onClick={() => handleReject(interview)}
                  >
                    Confirm Rejection
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setRejectingId(null); setRejectComment(''); }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 md:w-48">
            {interview.status === 'completed' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <Link href={`/employer/interviews/${interview.id}/results`}>
                    View Details
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="gap-2 bg-secondary hover:bg-secondary/90"
                  disabled={isUpdatingApplication}
                  onClick={() => handleHire(interview)}
                >
                  <Trophy className="h-4 w-4" />
                  Mark Hired
                </Button>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => setRejectingId(interview.id)}>
                  <UserX className="h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
            {interview.status === 'scheduled' && (
              <p className="text-xs text-muted-foreground text-center">
                Waiting for candidate to complete interview
              </p>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  const renderInterviews = (emptyIcon: React.ElementType, title: string, message: string) => {
    if (isLoading || isFetching) return <LoadingSkeleton />;
    if (interviews.length === 0) return <EmptyState icon={emptyIcon} title={title} message={message} />;
    return interviews.map((interview) => <InterviewCard key={interview.id} interview={interview} />);
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-secondary" />
          Interviews
        </h1>
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="font-medium">Could not load interview results</p>
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
          <Sparkles className="h-8 w-8 text-secondary" />
          Interviews
        </h1>
        <p className="text-muted-foreground mt-2">
          Review candidate interview responses and evaluations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Awaiting Response
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{counts?.scheduled ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
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
              Total Interviews
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{counts?.total ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="completed">Completed ({counts?.completed ?? 0})</TabsTrigger>
          <TabsTrigger value="scheduled">Awaiting Response ({counts?.scheduled ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="completed" className="space-y-4">
          {renderInterviews(Sparkles, 'No completed interviews yet', 'Completed interview results will appear here')}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {renderInterviews(Clock, 'No pending interviews', 'All candidates have completed their AI interviews')}
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
