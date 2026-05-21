'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetInterviewsQuery } from '@/lib/store';
import type { InterviewResponseData } from '@/lib/store/types';
import { Calendar, Clock, Video, Sparkles, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function InterviewsPage() {
  const { data, isLoading, isError } = useGetInterviewsQuery();

  const interviews = data?.data ?? [];
  const scheduledInterviews = interviews.filter(i => i.status === 'scheduled');
  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const cancelledInterviews = interviews.filter(i => i.status === 'cancelled');

  const avgAiScore =
    completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce((sum, i) => sum + (i.aiScore || 0), 0) /
            completedInterviews.length
        )
      : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const InterviewCard = ({ interview }: { interview: InterviewResponseData }) => (
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
              {interview.aiScore !== null && interview.aiScore !== undefined && interview.aiScore > 0 && (
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

  const LoadingSkeleton = () => (
    <>
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
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
          <Calendar className="h-8 w-8 text-primary" />
          My Interviews
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your scheduled and completed interviews
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
              Scheduled
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-2xl font-bold text-blue-600">{scheduledInterviews.length}</p>
            )}
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
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-2xl font-bold text-green-600">{completedInterviews.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Avg AI Score
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-2xl font-bold text-purple-600">{avgAiScore}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Interviews List with Tabs */}
      <Tabs defaultValue="scheduled" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scheduled">
            Scheduled ({scheduledInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledInterviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : scheduledInterviews.length > 0 ? (
            scheduledInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="font-semibold mb-2">No scheduled interviews</h3>
                <p className="text-sm text-muted-foreground">
                  Your upcoming interviews will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : completedInterviews.length > 0 ? (
            completedInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="font-semibold mb-2">No completed interviews</h3>
                <p className="text-sm text-muted-foreground">
                  Your interview history will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : cancelledInterviews.length > 0 ? (
            cancelledInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="font-semibold mb-2">No cancelled interviews</h3>
                <p className="text-sm text-muted-foreground">
                  Cancelled interviews will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
