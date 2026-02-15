'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { mockInterviews } from '@/lib/mock-data';
import { 
  Sparkles,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  Brain,
  Users,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';
import Link from 'next/link';

export default function InterviewResultsPage() {
  const params = useParams();
  const router = useRouter();
  const interview = mockInterviews.find(i => i.id === params.id);

  if (!interview) {
    return <div>Interview not found</div>;
  }

  // Mock AI evaluation results
  const results = {
    overallScore: interview.aiScore || 87,
    technicalScore: 85,
    communicationScore: 90,
    problemSolvingScore: 88,
    cultureFitScore: 85,
    strengths: [
      'Excellent communication skills and ability to articulate complex ideas clearly',
      'Strong technical knowledge and problem-solving approach',
      'Good understanding of software development best practices',
      'Demonstrated enthusiasm and passion for the role'
    ],
    improvements: [
      'Could provide more specific examples from past experiences',
      'Consider elaborating more on technical implementation details',
      'Work on structuring answers using the STAR method'
    ],
    summary: interview.aiSummary || 'The candidate demonstrated strong technical knowledge and excellent communication skills throughout the interview. They showed a clear understanding of the role requirements and provided thoughtful responses to behavioral questions. The candidate would be a good fit for the team and should progress to the next round.'
  };

  const ScoreCard = ({ title, score, icon: Icon, description }: any) => (
    <Card className="hover-lift">
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-primary hover:text-white hover:border-primary">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-primary hover:text-white hover:border-primary">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
      </div>

      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-2 hover-lift">
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
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-primary hover:bg-primary/90">
                    {results.overallScore >= 80 ? 'Excellent' : results.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                  <Badge variant="outline">AI Evaluated</Badge>
                </div>
              </div>
            </div>
            <div className="text-center p-8 bg-background rounded-xl border-2 border-primary shadow-lg">
              <p className="text-sm font-medium text-muted-foreground mb-3">Overall Score</p>
              <p className="text-6xl font-bold text-primary mb-2">{results.overallScore}</p>
              <p className="text-sm text-muted-foreground">out of 100</p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Top {Math.round((100 - results.overallScore) + 5)}% of candidates
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold">Performance Breakdown</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ScoreCard
            title="Technical Skills"
            score={results.technicalScore}
            icon={Brain}
            description="Problem-solving and technical knowledge"
          />
          <ScoreCard
            title="Communication"
            score={results.communicationScore}
            icon={MessageSquare}
            description="Clarity and articulation of ideas"
          />
          <ScoreCard
            title="Problem Solving"
            score={results.problemSolvingScore}
            icon={Lightbulb}
            description="Analytical thinking and approach"
          />
          <ScoreCard
            title="Cultural Fit"
            score={results.cultureFitScore}
            icon={Users}
            description="Alignment with company values"
          />
        </div>
      </div>

      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{results.summary}</p>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <TrendingUp className="h-5 w-5" />
            Key Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {results.strengths.map((strength, index) => (
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

      {/* Areas for Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <Lightbulb className="h-5 w-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {results.improvements.map((improvement, index) => (
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
