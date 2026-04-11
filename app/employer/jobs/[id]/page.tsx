'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  MapPin, Banknote, Briefcase, Calendar, Users, Clock,
  ArrowLeft, Building2, CheckCircle2, ListChecks, Gift,
  AlertCircle, RefreshCw, Edit, Trash2, TrendingUp, Star,
  Plus, X, FileText, Save,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useGetJobByIdQuery, useDeleteJobMutation, useUpdateJobMutation } from '@/lib/store';
import type { JobLocationType, JobType, JobExperienceLevel } from '@/lib/store';

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** ISO date string → "YYYY-MM-DD" for <input type="date"> */
function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return '';
  return iso.split('T')[0];
}

function StatusBadge({ status }: { status: string }) {
  return status === 'active' ? (
    <Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-100">
      Active
    </Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-100">
      Closed
    </Badge>
  );
}

function SectionList({ items }: { items: string[] }) {
  if (!items || items.length === 0)
    return <p className="text-sm text-muted-foreground">None specified</p>;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function EmployerJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data: job, isLoading, isError, refetch } = useGetJobByIdQuery(jobId);
  const [deleteJob, { isLoading: closing }] = useDeleteJobMutation();
  const [updateJob, { isLoading: saving }] = useUpdateJobMutation();

  // ── Edit form state ──────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState<JobLocationType | ''>('');
  const [jobType, setJobType] = useState<JobType | ''>('');
  const [experienceLevel, setExperienceLevel] = useState<JobExperienceLevel | ''>('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);

  const [confirmOpen, setConfirmOpen] = useState(false);

  // ── Helpers for dynamic lists ────────────────────────────

  const addItem = (list: string[], setList: (v: string[]) => void) =>
    setList([...list, '']);

  const removeItem = (i: number, list: string[], setList: (v: string[]) => void) =>
    setList(list.filter((_, idx) => idx !== i));

  const updateItem = (i: number, val: string, list: string[], setList: (v: string[]) => void) => {
    const next = [...list];
    next[i] = val;
    setList(next);
  };

  // ── Edit actions ─────────────────────────────────────────

  const handleStartEdit = () => {
    if (!job) return;
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location);
    setLocationType(job.locationType);
    setJobType(job.type);
    setExperienceLevel(job.experienceLevel);
    setSalary(job.salary);
    setDescription(job.description);
    setApplicationDeadline(toDateInputValue(job.applicationDeadline));
    setRequirements(job.requirements?.length ? job.requirements : ['']);
    setResponsibilities(job.responsibilities?.length ? job.responsibilities : ['']);
    setBenefits(job.benefits?.length ? job.benefits : ['']);
    setIsEditing(true);
  };

  const handleCancelEdit = () => setIsEditing(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationType || !jobType || !experienceLevel) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await updateJob({
        id: jobId,
        body: {
          title,
          company,
          location,
          locationType,
          type: jobType,
          experienceLevel,
          salary,
          description,
          requirements: requirements.filter(Boolean),
          responsibilities: responsibilities.filter(Boolean),
          benefits: benefits.filter(Boolean),
          ...(applicationDeadline ? { applicationDeadline } : {}),
        },
      }).unwrap();
      setIsEditing(false);
      toast.success('Job updated successfully');
    } catch {
      toast.error('Failed to update job. Please try again.');
    }
  };

  // ── Close job ─────────────────────────────────────────────

  const handleCloseJob = async () => {
    try {
      await deleteJob(jobId).unwrap();
      toast.success('Job closed successfully');
      router.push('/employer/jobs');
    } catch {
      toast.error('Failed to close job. Please try again.');
    }
  };

  // ── Loading ───────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-6 w-20" />)}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────

  if (isError || !job) {
    return (
      <div className="space-y-6">
        <Link href="/employer/jobs">
          <Button variant="ghost" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="font-medium text-lg">Could not load job details</p>
            <p className="text-sm text-muted-foreground">
              The job may have been removed or you may not have permission to view it.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => refetch()} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
              <Link href="/employer/jobs">
                <Button className="bg-secondary hover:bg-secondary/90">Back to Jobs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Edit mode ─────────────────────────────────────────────

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Edit header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
                <Edit className="h-6 w-6 text-secondary" />
                Edit Job
              </h1>
              <p className="text-sm text-muted-foreground">Update the details for this posting</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about the position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Frontend Developer"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    Company Name *
                  </Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationType" className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Location Type *
                  </Label>
                  <Select value={locationType} onValueChange={(v) => setLocationType(v as JobLocationType)}>
                    <SelectTrigger id="locationType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="jobType" className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    Job Type *
                  </Label>
                  <Select value={jobType} onValueChange={(v) => setJobType(v as JobType)}>
                    <SelectTrigger id="jobType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel" className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    Experience Level *
                  </Label>
                  <Select value={experienceLevel} onValueChange={(v) => setExperienceLevel(v as JobExperienceLevel)}>
                    <SelectTrigger id="experienceLevel">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry">Entry</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary" className="flex items-center gap-1.5">
                    <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
                    Salary Range *
                  </Label>
                  <Input
                    id="salary"
                    placeholder="e.g. 200,000 - 400,000 PKR"
                    required
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 md:w-1/2">
                <Label htmlFor="deadline" className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Application Deadline
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Detailed overview of the role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, team, and what makes this opportunity unique..."
                  rows={6}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-4 w-4 text-secondary" />
                Requirements
              </CardTitle>
              <CardDescription>Skills and qualifications needed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {requirements.map((req, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={req}
                    onChange={(e) => updateItem(i, e.target.value, requirements, setRequirements)}
                    placeholder="e.g. 5+ years of experience with React"
                  />
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(i, requirements, setRequirements)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem(requirements, setRequirements)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-secondary" />
                Responsibilities
              </CardTitle>
              <CardDescription>Key duties and tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {responsibilities.map((resp, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={resp}
                    onChange={(e) => updateItem(i, e.target.value, responsibilities, setResponsibilities)}
                    placeholder="e.g. Build and maintain web applications"
                  />
                  {responsibilities.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(i, responsibilities, setResponsibilities)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem(responsibilities, setResponsibilities)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Responsibility
              </Button>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-secondary" />
                Benefits
              </CardTitle>
              <CardDescription>Perks and benefits offered</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateItem(i, e.target.value, benefits, setBenefits)}
                    placeholder="e.g. Health insurance"
                  />
                  {benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(i, benefits, setBenefits)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem(benefits, setBenefits)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Benefit
              </Button>
            </CardContent>
          </Card>

          {/* Form actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-secondary hover:bg-secondary/90 gap-2"
              disabled={saving}
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

        </form>
      </div>
    );
  }

  // ── View mode ─────────────────────────────────────────────

  const isActive = job.status === 'active';
  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline) < new Date()
      ? 'Expired'
      : formatDate(job.applicationDeadline)
    : 'No deadline';

  return (
    <div className="space-y-6">

      {/* Back */}
      <Link href="/employer/jobs">
        <Button variant="ghost" className="gap-2 pl-0 hover:pl-0 -mb-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </Link>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            {/* Left — title + meta */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={job.status} />
                <Badge variant="secondary">{job.type}</Badge>
                <Badge variant="secondary">{job.locationType}</Badge>
                <Badge variant="secondary">{job.experienceLevel}</Badge>
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold">{job.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{job.company}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Banknote className="h-4 w-4 shrink-0" />
                  {job.salary}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 shrink-0" />
                  Posted {formatDate(job.postedDate)}
                </span>
              </div>
            </div>

            {/* Right — actions */}
            <div className="flex flex-col gap-2 md:w-52 shrink-0">
              <Link href={`/employer/applicants?jobId=${job.id}`}>
                <Button className="w-full bg-secondary hover:bg-secondary/90 gap-2">
                  <Users className="h-4 w-4" />
                  View Applicants ({job.applicantsCount ?? 0})
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleStartEdit}
              >
                <Edit className="h-4 w-4" />
                Edit Job
              </Button>

              {isActive && (
                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Close Job
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Close this job posting?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark <strong>{job.title}</strong> as closed. Applicants will no
                        longer be able to apply. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCloseJob}
                        disabled={closing}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {closing ? 'Closing...' : 'Yes, close it'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{job.applicantsCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">Total Applicants</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">{formatDate(job.postedDate)}</p>
              <p className="text-xs text-muted-foreground">Date Posted</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${deadline === 'Expired' ? 'bg-red-50' : 'bg-orange-50'}`}>
              <Clock className={`h-5 w-5 ${deadline === 'Expired' ? 'text-red-500' : 'text-orange-500'}`} />
            </div>
            <div>
              <p className={`text-sm font-semibold ${deadline === 'Expired' ? 'text-red-500' : ''}`}>
                {deadline}
              </p>
              <p className="text-xs text-muted-foreground">Application Deadline</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">{job.experienceLevel} Level</p>
              <p className="text-xs text-muted-foreground">Experience Required</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="h-5 w-5 text-secondary" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
            {job.description}
          </p>
        </CardContent>
      </Card>

      {/* Requirements + Responsibilities */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-5 w-5 text-secondary" />
              Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SectionList items={job.requirements} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-5 w-5 text-secondary" />
              Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SectionList items={job.responsibilities} />
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="h-5 w-5 text-secondary" />
              Benefits & Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, i) => (
                <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                  {benefit}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer meta */}
      <Separator />
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground pb-4">
        <span>Job ID: {job.id}</span>
        <span>Created: {formatDate(job.createdAt)}</span>
        <span>Last updated: {formatDate(job.updatedAt)}</span>
      </div>

    </div>
  );
}
