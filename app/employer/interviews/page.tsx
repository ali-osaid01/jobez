'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { mockInterviews } from '@/lib/mock-data';
import { Sparkles, UserCheck, UserX, Phone, Clock, MessageSquare } from 'lucide-react';

export default function EmployerInterviewsPage() {
  const [interviews] = useState(mockInterviews);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const pendingInterviews = interviews.filter(i => i.status === 'scheduled');

  const InterviewCard = ({ interview }: { interview: typeof interviews[0] }) => (
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
              <Badge variant="secondary">AI Interview</Badge>
              {interview.aiScore !== undefined && interview.aiScore > 0 && (
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
                    disabled={!rejectComment.trim()}
                    onClick={() => { setRejectingId(null); setRejectComment(''); }}
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
                <Button size="sm" className="bg-secondary hover:bg-secondary/90 gap-2">
                  <Sparkles className="h-4 w-4" />
                  View AI Results
                </Button>
                <Button size="sm" className="gap-2" variant="outline">
                  <UserCheck className="h-4 w-4" />
                  Shortlist
                </Button>
                <Button size="sm" className="gap-2" variant="outline">
                  <Phone className="h-4 w-4" />
                  Contact Candidate
                </Button>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => setRejectingId(interview.id)}>
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
            <p className="text-2xl font-bold text-yellow-600">{pendingInterviews.length}</p>
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
            <p className="text-2xl font-bold text-green-600">{completedInterviews.length}</p>
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
            <p className="text-2xl font-bold text-purple-600">{interviews.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Completed Interviews */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold">Completed Interviews</h2>
        {completedInterviews.length > 0 ? (
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
        {pendingInterviews.length > 0 ? (
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
