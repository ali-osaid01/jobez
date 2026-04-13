'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ArrowLeft, Sparkles, Plus, X, Briefcase, MapPin, Clock, TrendingUp, Banknote, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCreateJobMutation, useAppSelector, selectCurrentUser } from '@/lib/store';
import type { JobLocationType, JobType, JobExperienceLevel, ApiError } from '@/lib/store';
import { validateJobPostForm } from '@/lib/validations/job-post.validation';

export default function PostJobPage() {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const [createJob, { isLoading: saving }] = useCreateJobMutation();

  const [title, setTitle] = useState('');
  const [company] = useState(user?.company ?? '');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState<JobLocationType | ''>('');
  const [type, setType] = useState<JobType | ''>('');
  const [experienceLevel, setExperienceLevel] = useState<JobExperienceLevel | ''>('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateJobPostForm({
      title,
      location,
      locationType: locationType as JobLocationType,
      type: type as JobType,
      experienceLevel: experienceLevel as JobExperienceLevel,
      salary,
      description,
      applicationDeadline: applicationDeadline || undefined,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before publishing.');
      return;
    }

    setErrors({});

    try {
      await createJob({
        title: title.trim(),
        company,
        location: location.trim(),
        locationType: locationType as JobLocationType,
        type: type as JobType,
        experienceLevel: experienceLevel as JobExperienceLevel,
        salary: salary.trim(),
        description: description.trim(),
        requirements: requirements.filter(Boolean),
        responsibilities: responsibilities.filter(Boolean),
        benefits: benefits.filter(Boolean),
        ...(applicationDeadline ? { applicationDeadline } : {}),
      }).unwrap();

      toast.success('Job posted successfully!');
      router.push('/employer/jobs');
    } catch (err) {
      const apiErr = err as { data?: ApiError };
      const details = apiErr?.data?.error?.details;
      if (details) {
        setErrors(details);
        Object.values(details).forEach((msg) => toast.error(msg));
      } else {
        toast.error('Failed to post job. Please try again.');
      }
    }
  };

  const addItem = (list: string[], setList: (items: string[]) => void) => {
    setList([...list, '']);
  };

  const removeItem = (index: number, list: string[], setList: (items: string[]) => void) => {
    setList(list.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string, list: string[], setList: (items: string[]) => void) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/employer/jobs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-secondary" />
            Post a New Job
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new job posting to attract top talent
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />Job Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
                  className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />Location *
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); clearError('location'); }}
                  className={errors.location ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationType" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />Location Type *
                </Label>
                <Select value={locationType} onValueChange={(v) => { setLocationType(v as JobLocationType); clearError('locationType'); }}>
                  <SelectTrigger id="locationType" className={errors.locationType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                {errors.locationType && <p className="text-sm text-destructive">{errors.locationType}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />Job Type *
                </Label>
                <Select value={type} onValueChange={(v) => { setType(v as JobType); clearError('type'); }}>
                  <SelectTrigger id="type" className={errors.type ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />Experience Level *
                </Label>
                <Select value={experienceLevel} onValueChange={(v) => { setExperienceLevel(v as JobExperienceLevel); clearError('experienceLevel'); }}>
                  <SelectTrigger id="experience" className={errors.experienceLevel ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry">Entry</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experienceLevel && <p className="text-sm text-destructive">{errors.experienceLevel}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className="flex items-center gap-1.5">
                  <Banknote className="h-3.5 w-3.5 text-muted-foreground" />Salary Range *
                </Label>
                <Input
                  id="salary"
                  placeholder="e.g. 200,000 - 400,000 PKR"
                  value={salary}
                  onChange={(e) => { setSalary(e.target.value); clearError('salary'); }}
                  className={errors.salary ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.salary && <p className="text-sm text-destructive">{errors.salary}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />Application Deadline
                <span className="text-muted-foreground text-xs ml-1">(optional)</span>
              </Label>
              <Input
                id="applicationDeadline"
                type="date"
                value={applicationDeadline}
                onChange={(e) => { setApplicationDeadline(e.target.value); clearError('applicationDeadline'); }}
                className={errors.applicationDeadline ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.applicationDeadline && <p className="text-sm text-destructive">{errors.applicationDeadline}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Provide a detailed overview of the role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the role, team, and what makes this opportunity unique..."
                rows={5}
                value={description}
                onChange={(e) => { setDescription(e.target.value); clearError('description'); }}
                className={errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              <div className="flex justify-between items-center">
                {errors.description
                  ? <p className="text-sm text-destructive">{errors.description}</p>
                  : <span />
                }
                <span className={`text-xs ml-auto ${description.trim().length >= 50 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {description.trim().length} / 50 min
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>Skills and qualifications needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) => updateItem(index, e.target.value, requirements, setRequirements)}
                  placeholder="e.g. 5+ years of experience with React"
                />
                {requirements.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeItem(index, requirements, setRequirements)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem(requirements, setRequirements)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />Add Requirement
            </Button>
          </CardContent>
        </Card>

        {/* Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>Responsibilities</CardTitle>
            <CardDescription>Key duties and tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={resp}
                  onChange={(e) => updateItem(index, e.target.value, responsibilities, setResponsibilities)}
                  placeholder="e.g. Build and maintain web applications"
                />
                {responsibilities.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeItem(index, responsibilities, setResponsibilities)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem(responsibilities, setResponsibilities)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />Add Responsibility
            </Button>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
            <CardDescription>Perks and benefits offered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) => updateItem(index, e.target.value, benefits, setBenefits)}
                  placeholder="e.g. Health insurance"
                />
                {benefits.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeItem(index, benefits, setBenefits)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem(benefits, setBenefits)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />Add Benefit
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Link href="/employer/jobs" className="flex-1">
            <Button type="button" variant="outline" className="w-full" disabled={saving}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90" disabled={saving}>
            {saving ? 'Publishing...' : 'Publish Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}
