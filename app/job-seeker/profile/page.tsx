'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Plus, X, Award, DollarSign, FileText, ExternalLink,
  AlertCircle, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/lib/store/api/profileApi';
import type { ApiError } from '@/lib/store/types';

// ─── Edit Form Shape ──────────────────────────────────────────
// Separate from ProfileResponseData — only the editable fields.

type EditForm = {
  name: string;
  phone: string;
  title: string;
  location: string;
  experience: string;
  bio: string;
  skills: string[];
  education: { degree: string; institution: string; year: string }[];
  certifications: string[];
  workExperience: { title: string; company: string; duration: string }[];
  preferredRole: string;
  expectedSalary: string;
};

function initEditForm(profileData: NonNullable<ReturnType<typeof useGetProfileQuery>['data']>): EditForm {
  return {
    name: profileData.name || '',
    phone: profileData.phone || '',
    title: profileData.title || '',
    location: profileData.location || '',
    experience: profileData.experience || '',
    bio: profileData.bio || '',
    skills: profileData.skills || [],
    education: profileData.education || [],
    certifications: profileData.certifications || [],
    workExperience: profileData.workExperience || [],
    preferredRole: profileData.preferredRole || '',
    expectedSalary: profileData.expectedSalary || '',
  };
}

// ─── Page ─────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: profileData, isLoading, isError, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  // editForm is only non-null while the user has the form open.
  // When null, the page renders directly from profileData (no sync needed).
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const isEditing = editForm !== null;

  const [newSkill, setNewSkill] = useState('');

  const handleStartEdit = () => {
    if (!profileData) return;
    setEditForm(initEditForm(profileData));
  };

  const handleCancel = () => {
    setEditForm(null);
    setNewSkill('');
  };

  const handleSave = async () => {
    if (!editForm) return;

    const cleanEducation = editForm.education
      .map((item) => ({
        degree: item.degree.trim(),
        institution: item.institution.trim(),
        year: item.year.trim(),
      }))
      .filter((item) => item.degree || item.institution || item.year);
    const cleanWorkExperience = editForm.workExperience
      .map((item) => ({
        title: item.title.trim(),
        company: item.company.trim(),
        duration: item.duration.trim(),
      }))
      .filter((item) => item.title || item.company || item.duration);
    const cleanCertifications = editForm.certifications
      .map((certification) => certification.trim())
      .filter(Boolean);

    try {
      await updateProfile({
        name: editForm.name || null,
        phone: editForm.phone || null,
        title: editForm.title || null,
        experience: editForm.experience || null,
        skills: editForm.skills,
        location: editForm.location || null,
        expectedSalary: editForm.expectedSalary || null,
        education: cleanEducation,
        certifications: cleanCertifications,
        workExperience: cleanWorkExperience,
        preferredRole: editForm.preferredRole || null,
        bio: editForm.bio || null,
      }).unwrap();
      await refetch();
      setEditForm(null);
      setNewSkill('');
      toast.success('Profile updated successfully');
    } catch (err) {
      const apiError = err as { data?: ApiError };
      const message =
        apiError.data?.error?.message ?? 'Failed to update profile. Please try again.';
      toast.error(message);
    }
  };

  const addSkill = () => {
    if (!editForm || !newSkill || editForm.skills.includes(newSkill)) return;
    setEditForm({ ...editForm, skills: [...editForm.skills, newSkill] });
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    if (!editForm) return;
    setEditForm({ ...editForm, skills: editForm.skills.filter(s => s !== skill) });
  };

  const addEducation = () => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      education: [...editForm.education, { degree: '', institution: '', year: '' }],
    });
  };

  const updateEducation = (
    index: number,
    field: keyof EditForm['education'][number],
    value: string,
  ) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      education: editForm.education.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeEducation = (index: number) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      education: editForm.education.filter((_, itemIndex) => itemIndex !== index),
    });
  };

  const addWorkExperience = () => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      workExperience: [...editForm.workExperience, { title: '', company: '', duration: '' }],
    });
  };

  const updateWorkExperience = (
    index: number,
    field: keyof EditForm['workExperience'][number],
    value: string,
  ) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      workExperience: editForm.workExperience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeWorkExperience = (index: number) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      workExperience: editForm.workExperience.filter((_, itemIndex) => itemIndex !== index),
    });
  };

  const addCertification = () => {
    if (!editForm) return;
    setEditForm({ ...editForm, certifications: [...editForm.certifications, ''] });
  };

  const updateCertification = (index: number, value: string) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      certifications: editForm.certifications.map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    });
  };

  const removeCertification = (index: number) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      certifications: editForm.certifications.filter((_, itemIndex) => itemIndex !== index),
    });
  };

  // ── Loading ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Error / no data ────────────────────────────────────────

  if (isError || !profileData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <User className="h-8 w-8 text-primary" />
          My Profile
        </h1>
        <Card>
          <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="font-medium">Could not load your profile</p>
            <p className="text-sm text-muted-foreground">
              Check your connection or try again.
            </p>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Helpers: read from editForm when editing, profileData when viewing ──

  const str = (edit: string, server: string | null | undefined) =>
    isEditing ? edit : (server || '');

  // Arrays always come from the active source
  const skills        = isEditing ? editForm!.skills        : (profileData.skills        || []);
  const education     = isEditing ? editForm!.education     : (profileData.education     || []);
  const workExp       = isEditing ? editForm!.workExperience: (profileData.workExperience|| []);
  const certifications= isEditing ? editForm!.certifications: (profileData.certifications|| []);

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            My Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and job preferences
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={handleStartEdit}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic contact and profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={str(editForm?.name ?? '', profileData.name)}
                  onChange={(e) => editForm && setEditForm({ ...editForm, name: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={str(editForm?.phone ?? '', profileData.phone)}
                  onChange={(e) => editForm && setEditForm({ ...editForm, phone: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={str(editForm?.location ?? '', profileData.location)}
                  onChange={(e) => editForm && setEditForm({ ...editForm, location: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Your career details and job preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="title"
                  value={str(editForm?.title ?? '', profileData.title)}
                  onChange={(e) => editForm && setEditForm({ ...editForm, title: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                value={str(editForm?.experience ?? '', profileData.experience)}
                onChange={(e) => editForm && setEditForm({ ...editForm, experience: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredRole">Preferred Role</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="preferredRole"
                  placeholder="e.g. Frontend Developer"
                  value={str(editForm?.preferredRole ?? '', profileData.preferredRole)}
                  onChange={(e) => editForm && setEditForm({ ...editForm, preferredRole: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expectedSalary"
                  placeholder="e.g. $80,000 – $100,000"
                  value={str(editForm?.expectedSalary ?? '', profileData.expectedSalary)}
                  onChange={(e) => editForm && setEditForm({ ...editForm, expectedSalary: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={str(editForm?.bio ?? '', profileData.bio)}
              onChange={(e) => editForm && setEditForm({ ...editForm, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>

          {profileData.resumeUrl && (
            <div className="space-y-2">
              <Label>Resume</Label>
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/40">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <a
                  href={profileData.resumeUrl.replace('/raw/upload/', '/raw/upload/fl_attachment/')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1 truncate"
                >
                  Download Resume
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Your technical and professional skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                  {skill}
                  {isEditing && (
                    <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button onClick={addSkill} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Education
          </CardTitle>
          <CardDescription>Your academic background</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">Education {index + 1}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeEducation(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`degree-${index}`}>Degree</Label>
                        <Input
                          id={`degree-${index}`}
                          value={edu.degree}
                          placeholder="e.g. BS Computer Science"
                          onChange={(event) => updateEducation(index, 'degree', event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`institution-${index}`}>Institution</Label>
                        <Input
                          id={`institution-${index}`}
                          value={edu.institution}
                          placeholder="e.g. University of Punjab"
                          onChange={(event) => updateEducation(index, 'institution', event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`education-year-${index}`}>Year</Label>
                        <Input
                          id={`education-year-${index}`}
                          value={edu.year}
                          placeholder="e.g. 2024"
                          onChange={(event) => updateEducation(index, 'year', event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No education added yet</p>
              )}
              <Button type="button" variant="outline" className="w-full gap-2" onClick={addEducation}>
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
            </>
          ) : education.length > 0 ? (
            education.map((edu, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-1">
                <h4 className="font-semibold">{edu.degree}</h4>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                <p className="text-xs text-muted-foreground">Graduated: {edu.year}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No education added yet</p>
          )}
        </CardContent>
      </Card>

      {/* Work Experience */}
      {(workExp.length > 0 || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Work Experience
            </CardTitle>
            <CardDescription>Your professional history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                {workExp.length > 0 ? (
                  workExp.map((work, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">Work Experience {index + 1}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeWorkExperience(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`work-title-${index}`}>Title</Label>
                          <Input
                            id={`work-title-${index}`}
                            value={work.title}
                            placeholder="e.g. Frontend Developer"
                            onChange={(event) => updateWorkExperience(index, 'title', event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`work-company-${index}`}>Company</Label>
                          <Input
                            id={`work-company-${index}`}
                            value={work.company}
                            placeholder="e.g. Systems Limited"
                            onChange={(event) => updateWorkExperience(index, 'company', event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`work-duration-${index}`}>Duration</Label>
                          <Input
                            id={`work-duration-${index}`}
                            value={work.duration}
                            placeholder="e.g. 2022 - Present"
                            onChange={(event) => updateWorkExperience(index, 'duration', event.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No work experience added yet</p>
                )}
                <Button type="button" variant="outline" className="w-full gap-2" onClick={addWorkExperience}>
                  <Plus className="h-4 w-4" />
                  Add Work Experience
                </Button>
              </>
            ) : (
              workExp.map((work, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-1">
                  <h4 className="font-semibold">{work.title}</h4>
                  <p className="text-sm text-muted-foreground">{work.company}</p>
                  <p className="text-xs text-muted-foreground">{work.duration}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {(certifications.length > 0 || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certifications
            </CardTitle>
            <CardDescription>Your professional certifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                {certifications.length > 0 ? (
                  <div className="space-y-3">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={cert}
                          placeholder="e.g. AWS Certified Developer"
                          onChange={(event) => updateCertification(index, event.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCertification(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No certifications added yet</p>
                )}
                <Button type="button" variant="outline" className="w-full gap-2" onClick={addCertification}>
                  <Plus className="h-4 w-4" />
                  Add Certification
                </Button>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="text-sm py-1 px-3">
                    {cert}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
