'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getJobById } from '@/lib/mock-data';
import { 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  Building2,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const job = getJobById(params.id as string);
  const [applied, setApplied] = useState(false);

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Job not found</h2>
        <Link href="/job-seeker/jobs">
          <Button variant="link">Back to jobs</Button>
        </Link>
      </div>
    );
  }

  const handleApply = () => {
    setApplied(true);
    toast.success('Application submitted successfully!');
    setTimeout(() => {
      router.push('/job-seeker/applications');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/job-seeker/jobs">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Button>
      </Link>

      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-4 flex-1">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-heading font-bold">{job.title}</h1>
                  <p className="text-xl text-muted-foreground flex items-center gap-2 mt-1">
                    <Building2 className="h-5 w-5" />
                    {job.company}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {job.postedDate}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">{job.type}</Badge>
                <Badge variant="secondary" className="text-sm">{job.locationType}</Badge>
                <Badge variant="secondary" className="text-sm">{job.experienceLevel} Level</Badge>
                {job.matchScore && (
                  <Badge className="bg-green-100 text-green-800 border-green-300 text-sm">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {job.matchScore}% match
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 md:w-48">
              {!applied ? (
                <>
                  <Button size="lg" onClick={handleApply} className="w-full">
                    Apply Now
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={() => toast.success('Job saved to bookmarks')}>
                    Save Job
                  </Button>
                </>
              ) : (
                <div className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Applied!</p>
                  <p className="text-xs text-green-700">Redirecting...</p>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Job Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{job.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{resp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>About {job.company}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Leading technology company focused on innovation and growth.
                </p>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">Technology</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company Size</span>
                  <span className="font-medium">500-1000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applicants</span>
                  <span className="font-medium">{job.applicantsCount || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Match Insights */}
          {job.matchScore && job.matchScore > 80 && (
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  AI Match Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  This role is a great match for your profile!
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Strong skills alignment</li>
                  <li>• Experience level match</li>
                  <li>• Location preference fit</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
