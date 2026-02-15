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
import { ArrowLeft, Sparkles, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PostJobPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success('Job posted successfully!');
      router.push('/employer/jobs');
    }, 1500);
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about the position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" placeholder="e.g. Senior Frontend Developer" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input id="company" placeholder="Your company name" required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" placeholder="e.g. San Francisco, CA" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationType">Location Type *</Label>
                <Select required>
                  <SelectTrigger id="locationType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level *</Label>
                <Select required>
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range *</Label>
                <Input id="salary" placeholder="e.g. 200,000 - 400,000 PKR" required />
              </div>
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, team, and what makes this opportunity unique..."
                rows={5}
                required
              />
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
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeItem(index, requirements, setRequirements)}
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
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeItem(index, responsibilities, setResponsibilities)}
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
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeItem(index, benefits, setBenefits)}
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
