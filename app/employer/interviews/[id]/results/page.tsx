'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Brain, Lightbulb, MessageSquare, Sparkles, TrendingUp, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetInterviewByIdQuery, useGetInterviewResultsQuery } from '@/lib/store/api/interviewsApi';

function ScoreCard({
  title,
  score,
  icon: Icon,
  description,
}: {
  title: string;
  score: number;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-secondary/10 p-2">
              <Icon className="h-5 w-5 text-secondary" />
            </div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Badge
            variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}
            className="px-3 py-1 text-lg"
          >
            {score}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={score} className="h-3" />
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function EmployerInterviewResultsPage() {
  const params = useParams();
  const interviewId = params.id as string;

  const { data: interview, isLoading: interviewLoading } = useGetInterviewByIdQuery(interviewId);
  const { data: results, isLoading: resultsLoading, isError } = useGetInterviewResultsQuery(interviewId);
  const isLoading = interviewLoading || resultsLoading;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, index) => <Skeleton key={index} className="h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!interview || isError || !results) {
    return (
      <div className="mx-auto max-w-5xl py-20 text-center text-muted-foreground">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 opacity-40" />
        <p>Interview results are not available yet.</p>
        <Link href="/employer/interviews">
          <Button className="mt-4" variant="outline">Back to Interviews</Button>
        </Link>
      </div>
    );
  }

  const overallScore = results.overallScore ?? 0;
  const responses = results.responses ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link href="/employer/interviews">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to interviews
        </Button>
      </Link>

      <Card className="border-2 bg-gradient-to-br from-secondary/10 via-background to-primary/10">
        <CardHeader>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-3xl">
                <div className="rounded-lg bg-secondary/20 p-2">
                  <Sparkles className="h-7 w-7 text-secondary" />
                </div>
                Candidate Interview Results
              </CardTitle>
              <div className="space-y-1">
                <p className="text-lg font-medium">{interview.applicantName || 'Candidate'}</p>
                <p className="text-muted-foreground">{interview.jobTitle}</p>
                <p className="text-sm text-muted-foreground">{responses.length} transcript responses captured</p>
              </div>
            </div>
            <div className="rounded-xl border-2 border-secondary bg-background p-8 text-center shadow-lg">
              <p className="mb-3 text-sm font-medium text-muted-foreground">Overall Score</p>
              <p className="mb-2 text-6xl font-bold text-secondary">{overallScore}</p>
              <p className="text-sm text-muted-foreground">out of 100</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">{results.summary}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold">Performance Breakdown</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ScoreCard title="Technical Skills" score={results.technicalScore ?? 0} icon={Brain} description="Problem-solving and technical knowledge" />
          <ScoreCard title="Communication" score={results.communicationScore ?? 0} icon={MessageSquare} description="Clarity and articulation of ideas" />
          <ScoreCard title="Problem Solving" score={results.problemSolvingScore ?? 0} icon={Lightbulb} description="Analytical thinking and approach" />
          <ScoreCard title="Cultural Fit" score={results.cultureFitScore ?? 0} icon={Users} description="Alignment with company values" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-5 w-5" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(results.strengths ?? []).map((strength, index) => (
                <li key={index} className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900">
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Lightbulb className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(results.improvements ?? []).map((improvement, index) => (
                <li key={index} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  {improvement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-secondary" />
            Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {responses.length > 0 ? (
            responses.map((response, index) => (
              <div key={`${response.questionId}-${index}`} className="rounded-lg border p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">Response {index + 1}</p>
                  <Badge variant="secondary">{response.duration}s</Badge>
                </div>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{response.response}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No transcript responses were captured.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
