'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetInterviewByIdQuery, useGetInterviewResultsQuery } from '@/lib/store/api/interviewsApi';
import {
  Sparkles,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  Brain,
  Users,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function InterviewResultsPage() {
  const params = useParams();
  const interviewId = params.id as string;

  const { data: interview, isLoading: interviewLoading } = useGetInterviewByIdQuery(interviewId);
  const { data: results, isLoading: resultsLoading, isError: resultsError } = useGetInterviewResultsQuery(interviewId);

  const isLoading = interviewLoading || resultsLoading;

  const ScoreCard = ({ title, score, icon: Icon, description }: {
    title: string;
    score: number;
    icon: React.ElementType;
    description: string;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Badge
            variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}
            className="text-lg px-3 py-1"
          >
            {score}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={score} className="h-3" />
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-40" />
        <p>Interview not found.</p>
        <Link href="/job-seeker/interviews">
          <Button className="mt-4" variant="outline">Back to Interviews</Button>
        </Link>
      </div>
    );
  }

  if (interview.type !== 'ai') {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/job-seeker/interviews">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to interviews
          </Button>
        </Link>

        <Card className="bg-gradient-to-br from-secondary/10 via-background to-primary/10 border-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-3">
                <CardTitle className="text-3xl flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Users className="h-7 w-7 text-secondary" />
                  </div>
                  Human Interview Results
                </CardTitle>
                <div className="space-y-1">
                  <p className="text-lg font-medium">{interview.jobTitle} at {interview.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {interview.status === 'completed'
                      ? `Completed on ${interview.scheduledDate}`
                      : `Scheduled on ${interview.scheduledDate} at ${interview.scheduledTime}`}
                  </p>
                </div>
              </div>
              {interview.status === 'completed' && interview.aiScore !== null && (
                <div className="text-center p-8 bg-background rounded-xl border-2 border-secondary shadow-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Interview Score</p>
                  <p className="text-6xl font-bold text-secondary mb-2">{interview.aiScore}</p>
                  <p className="text-sm text-muted-foreground">out of 100</p>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {interview.status === 'completed' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-secondary" />
                Employer Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {interview.aiSummary || 'The employer has marked this interview completed. Feedback is not available yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Interview Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">This human interview has not been completed yet.</p>
              <Link href={`/job-seeker/interviews/${interview.id}`}>
                <Button variant="outline">View Meeting Details</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (resultsError || !results) {
    // Fallback: use aiScore and aiSummary stored on the interview itself
    const fallbackScore = interview.aiScore ?? 0;
    const fallbackSummary = interview.aiSummary ?? 'Interview evaluation is being processed. Please check back later.';
    const evaluation = interview.evaluation;

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/job-seeker/interviews">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to interviews
            </Button>
          </Link>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-3">
                <CardTitle className="text-3xl flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  AI Interview Results
                </CardTitle>
                <div className="space-y-1">
                  <p className="text-lg font-medium">{interview.jobTitle} at {interview.company}</p>
                  <p className="text-sm text-muted-foreground">Completed on {interview.scheduledDate}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-primary hover:bg-primary/90">
                      {fallbackScore >= 80 ? 'Excellent' : fallbackScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                    <Badge variant="outline">AI Evaluated</Badge>
                  </div>
                </div>
              </div>
              <div className="text-center p-8 bg-background rounded-xl border-2 border-primary shadow-lg">
                <p className="text-sm font-medium text-muted-foreground mb-3">Overall Score</p>
                <p className="text-6xl font-bold text-primary mb-2">{fallbackScore}</p>
                <p className="text-sm text-muted-foreground">out of 100</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {evaluation && (
          <div className="grid gap-4 md:grid-cols-2">
            {evaluation.technicalScore !== undefined && (
              <ScoreCard title="Technical Skills" score={evaluation.technicalScore} icon={Brain} description="Problem-solving and technical knowledge" />
            )}
            {evaluation.communicationScore !== undefined && (
              <ScoreCard title="Communication" score={evaluation.communicationScore} icon={MessageSquare} description="Clarity and articulation of ideas" />
            )}
            {evaluation.problemSolvingScore !== undefined && (
              <ScoreCard title="Problem Solving" score={evaluation.problemSolvingScore} icon={Lightbulb} description="Analytical thinking and approach" />
            )}
            {evaluation.cultureFitScore !== undefined && (
              <ScoreCard title="Cultural Fit" score={evaluation.cultureFitScore} icon={Users} description="Alignment with company values" />
            )}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{fallbackSummary}</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader><CardTitle>Next Steps</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Based on your performance, here's what happens next:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><div className="h-2 w-2 bg-primary rounded-full"></div><span>Your results have been shared with the hiring team</span></div>
              <div className="flex items-center gap-2"><div className="h-2 w-2 bg-primary rounded-full"></div><span>You'll receive feedback within 3-5 business days</span></div>
              <div className="flex items-center gap-2"><div className="h-2 w-2 bg-primary rounded-full"></div><span>High-scoring candidates will be contacted for next round</span></div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <Link href="/job-seeker/dashboard" className="flex-1">
                <Button variant="outline" className="w-full hover:bg-primary hover:text-white hover:border-primary">Return to Dashboard</Button>
              </Link>
              <Link href="/job-seeker/jobs" className="flex-1">
                <Button className="w-full bg-primary hover:bg-primary/90">Browse More Jobs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallScore = results.overallScore ?? 0;
  const strengths = results.strengths ?? [];
  const improvements = results.improvements ?? [];
  const summaryText = results.summary || 'Interview evaluation is being processed. Please check back later.';
  const responseCount = results.responses?.length ?? 0;
  const transcript = results.responses ?? [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/job-seeker/interviews">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to interviews
          </Button>
        </Link>
      </div>

      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-2">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <CardTitle className="text-3xl flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                AI Interview Results
              </CardTitle>
              <div className="space-y-1">
                <p className="text-lg font-medium">
                  {interview.jobTitle} at {interview.company}
                </p>
                <p className="text-sm text-muted-foreground">
                  Completed on {interview.scheduledDate}
                </p>
                <p className="text-sm text-muted-foreground">
                  {responseCount} responses captured
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-primary hover:bg-primary/90">
                    {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                  <Badge variant="outline">AI Evaluated</Badge>
                </div>
              </div>
            </div>
            <div className="text-center p-8 bg-background rounded-xl border-2 border-primary shadow-lg">
              <p className="text-sm font-medium text-muted-foreground mb-3">Overall Score</p>
              <p className="text-6xl font-bold text-primary mb-2">{overallScore}</p>
              <p className="text-sm text-muted-foreground">out of 100</p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Top {Math.max(5, Math.round((100 - overallScore) + 5))}% of candidates
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{summaryText}</p>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold">Performance Breakdown</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ScoreCard title="Technical Skills" score={results.technicalScore ?? 0} icon={Brain} description="Problem-solving and technical knowledge" />
          <ScoreCard title="Communication" score={results.communicationScore ?? 0} icon={MessageSquare} description="Clarity and articulation of ideas" />
          <ScoreCard title="Problem Solving" score={results.problemSolvingScore ?? 0} icon={Lightbulb} description="Analytical thinking and approach" />
          <ScoreCard title="Cultural Fit" score={results.cultureFitScore ?? 0} icon={Users} description="Alignment with company values" />
        </div>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-5 w-5" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="p-1 bg-green-200 rounded-full flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-green-900">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Areas for Improvement */}
      {improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Lightbulb className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="p-1 bg-amber-200 rounded-full flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 bg-amber-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-amber-900">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Interview Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {transcript.length > 0 ? (
            transcript.map((item, index) => (
              <div key={`${item.questionId}-${index}`} className="rounded-lg border p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="secondary">Question {index + 1}</Badge>
                  <span className="text-xs text-muted-foreground">{item.duration}s answer</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Question</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.question}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Your answer</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{item.response}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No transcript responses were captured.</p>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Based on your performance, here's what happens next:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>Your results have been shared with the hiring team</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>You'll receive feedback within 3-5 business days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>High-scoring candidates will be contacted for next round</span>
            </div>
          </div>
          <Separator />
          <div className="flex gap-3">
            <Link href="/job-seeker/dashboard" className="flex-1">
              <Button variant="outline" className="w-full hover:bg-primary hover:text-white hover:border-primary">
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/job-seeker/jobs" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Browse More Jobs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
