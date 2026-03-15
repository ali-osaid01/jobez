'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Plus, X, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentUser } from '@/lib/store/features/authSlice';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/lib/store/api/profileApi';
import type { ApiError } from '@/lib/store/types';

export default function ProfilePage() {
  const user = useAppSelector(selectCurrentUser);
  const { data: profileData, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    location: '',
    experience: '',
    bio: '',
    skills: [] as string[],
    education: [] as { degree: string; institution: string; year: string }[],
    certifications: [] as string[],
    workExperience: [] as { title: string; company: string; duration: string }[],
    preferredRole: '',
    expectedSalary: '',
  });

  const [newSkill, setNewSkill] = useState('');

  // Populate form when profile data loads (backend returns flat fields)
  useEffect(() => {
    if (!user || !profileData) return;

    setProfile({
      name: profileData.name || user.name || '',
      email: profileData.email || user.email || '',
      phone: profileData.phone || user.phone || '',
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
    });
  }, [user, profileData]);

  const handleSave = async () => {
    try {
      await updateProfile({
        title: profile.title,
        experience: profile.experience,
        skills: profile.skills,
        location: profile.location,
        expectedSalary: profile.expectedSalary,
        education: profile.education,
        certifications: profile.certifications,
        workExperience: profile.workExperience,
        preferredRole: profile.preferredRole,
        bio: profile.bio,
      }).unwrap();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      const apiError = err as { data?: ApiError };
      const message =
        apiError.data?.error?.message ?? 'Failed to update profile. Please try again.';
      toast.error(message);
    }
  };

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

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
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
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
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
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
          <CardDescription>Your career details and experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="title"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
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
            {profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-destructive"
                    >
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
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
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
          {profile.education.length > 0 ? (
            profile.education.map((edu, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
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
      {profile.workExperience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Work Experience
            </CardTitle>
            <CardDescription>Your professional history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.workExperience.map((work, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-semibold">{work.title}</h4>
                <p className="text-sm text-muted-foreground">{work.company}</p>
                <p className="text-xs text-muted-foreground">{work.duration}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {profile.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certifications
            </CardTitle>
            <CardDescription>Your professional certifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="text-sm py-1 px-3">
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
