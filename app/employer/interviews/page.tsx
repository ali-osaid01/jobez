'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useGetInterviewsQuery } from '@/lib/store/api/interviewsApi';
import { useUpdateApplicationStatusMutation, useContactApplicantMutation } from '@/lib/store';
import type { InterviewResponseData } from '@/lib/store/types';
import { Sparkles, UserCheck, UserX, Phone, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EmployerInterviewsPage() {
  const { data, isLoading, isError } = useGetInterviewsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
  const [contactApplicant, { isLoading: isContacting }] = useContactApplicantMutation();

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  const interviews = data?.data ?? [];
  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const pendingInterviews = interviews.filter(i => i.status === 'scheduled');

  const handleShortlist = async (interview: InterviewResponseData) => {
    try {
      await updateStatus({ id: interview.applicationId, body: { status: 'shortlisted' } }).unwrap();
      toast.success(`${interview.applicantName} has been shortlisted`);
    } catch {
      toast.error('Failed to shortlist candidate');
    }
  };

  const handleReject = async (interview: InterviewResponseData) => {
    if (!rejectComment.trim()) return;
    try {
      await updateStatus({ id: interview.applicationId, body: { status: 'rejected', rejectionReason: rejectComment } }).unwrap();
      toast.success('Candidate has been rejected');
      setRejectingId(null);
      setRejectComment('');
    } catch {
      toast.error('Failed to reject candidate');
    }
  };

  const handleContact = async (interview: InterviewResponseData) => {
    try {
      await contactApplicant(interview.applicationId).unwrap();
      toast.success(`Contact request sent to ${interview.applicantName}`);
    } catch {
      toast.error('Failed to send contact request');
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
              {interview.type === 'human' ? 'Human Interview' : 'AI Interview'}
              </Badge>
              {interview.aiScore !== null && interview.aiScore !== undefined && interview.aiScore > 0 && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  AI Score: {interview.aiScore}/100
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
                  AI Evaluation Summary
                </p>
                <p className="text-sm text-muted-foreground italic">
                  {interview.aiSummary}
                </p>
              </div>
            )}

            {/* Reject comment form */}
            {rejectingId === interview.id && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Rejection reason (required):</p>
                <Textarea
                  placeholder="Please provide a reason for rejection..."
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!rejectComment.trim() || isUpdating}
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
                <Link href={`/job-seeker/interviews/${interview.id}/results`}>
                  <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90 gap-2">
                    <Sparkles className="h-4 w-4" />
                    View AI Results
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="gap-2"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() => handleShortlist(interview)}
                >
                  <UserCheck className="h-4 w-4" />
                  Shortlist
                </Button>
                <Button
                  size="sm"
                  className="gap-2"
                  variant="outline"
                  disabled={isContacting}
                  onClick={() => handleContact(interview)}
                >
                  <Phone className="h-4 w-4" />
                  Contact Candidate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setRejectingId(interview.id)}
                >
                  <UserX className="h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
            {interview.status === 'scheduled' && (
              <p className="text-xs text-muted-foreground text-center">
                Waiting for candidate to complete AI interview
              </p>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  const LoadingSkeleton = () => (
    <>
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-secondary" />
          AI Interview Results
        </h1>
        <p className="text-muted-foreground mt-2">
          Review candidate AI interview responses and evaluations
        </p>
      </div>

      {/* Error */}
      {isError && (
        <Card>
          <CardContent className="py-8 flex flex-col items-center gap-2 text-center text-muted-foreground">
            <AlertCircle className="h-6 w-6 text-destructive" />
            Failed to load interviews. Please try again.
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Awaiting Response
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <p className="text-2xl font-bold text-yellow-600">{pendingInterviews.length}</p>
            )}
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
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <p className="text-2xl font-bold text-green-600">{completedInterviews.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Total AI Interviews
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <p className="text-2xl font-bold text-purple-600">{interviews.length}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completed Interviews */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold">Completed Interviews</h2>
        {isLoading ? (
          <LoadingSkeleton />
        ) : completedInterviews.length > 0 ? (
          <div className="space-y-4">
            {completedInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="font-semibold mb-2">No completed interviews yet</h3>
              <p className="text-sm text-muted-foreground">
                Completed AI interview results will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pending Interviews */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold">Awaiting Candidate Response</h2>
        {isLoading ? (
          <LoadingSkeleton />
        ) : pendingInterviews.length > 0 ? (
          <div className="space-y-4">
            {pendingInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="font-semibold mb-2">No pending interviews</h3>
              <p className="text-sm text-muted-foreground">
                All candidates have completed their AI interviews
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
