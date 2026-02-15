'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Sparkles, ArrowRight, ArrowLeft, CheckCircle, Building2, MapPin, Wrench, Briefcase as BriefcaseIcon, GraduationCap, Target, TrendingUp, Banknote, FileText, Globe, Users, Award, Factory } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Logo } from '@/components/logo';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Job Seeker Form Data
  const [seekerData, setSeekerData] = useState({
    resumeUploaded: false,
    resumeFile: null as File | null,
    title: '',
    experience: '',
    skills: [] as string[],
    location: '',
    expectedSalary: '',
    education: [] as { degree: string; institution: string; year: string }[],
    certifications: [] as string[],
    workExperience: [] as { title: string; company: string; duration: string }[],
    preferredRole: '',
    bio: ''
  });

  const [certInput, setCertInput] = useState('');
  const [educationForm, setEducationForm] = useState({ degree: '', institution: '', year: '' });
  const [workForm, setWorkForm] = useState({ title: '', company: '', duration: '' });

  // Employer Form Data
  const [employerData, setEmployerData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    location: '',
    website: '',
    description: ''
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const userStr = localStorage.getItem('jobez_user');
      if (!userStr) {
        router.push('/signup');
        return;
      }

      const userData = JSON.parse(userStr);
      if (userData.onboardingComplete) {
        if (userData.role === 'job-seeker') {
          router.push('/job-seeker/dashboard');
        } else {
          router.push('/employer/dashboard');
        }
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error('[v0] Error loading user:', error);
      router.push('/signup');
    }
  }, [router, mounted]);

  const handleAddSkill = () => {
    if (skillInput && !seekerData.skills.includes(skillInput)) {
      setSeekerData({
        ...seekerData,
        skills: [...seekerData.skills, skillInput]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSeekerData({
      ...seekerData,
      skills: seekerData.skills.filter(s => s !== skill)
    });
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setSeekerData({ ...seekerData, resumeFile: file, resumeUploaded: true });
      // In a real app, you'd upload to cloud storage here
    }
  };

  const handleAddCertification = () => {
    if (certInput && !seekerData.certifications.includes(certInput)) {
      setSeekerData({
        ...seekerData,
        certifications: [...seekerData.certifications, certInput]
      });
      setCertInput('');
    }
  };

  const handleAddEducation = () => {
    if (educationForm.degree && educationForm.institution) {
      setSeekerData({
        ...seekerData,
        education: [...seekerData.education, educationForm]
      });
      setEducationForm({ degree: '', institution: '', year: '' });
    }
  };

  const handleAddWorkExperience = () => {
    if (workForm.title && workForm.company) {
      setSeekerData({
        ...seekerData,
        workExperience: [...seekerData.workExperience, workForm]
      });
      setWorkForm({ title: '', company: '', duration: '' });
    }
  };

  const handleNext = () => {
    if (user?.role === 'job-seeker' && step < 5) {
      setStep(step + 1);
    } else if (user?.role === 'employer' && step < 2) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      // Update user data with onboarding info
      const updatedUser = {
        ...user,
        onboardingComplete: true,
        ...(user.role === 'job-seeker' ? seekerData : employerData)
      };

      localStorage.setItem('jobez_user', JSON.stringify(updatedUser));
      localStorage.setItem('jobez_auth', 'true');

      toast.success('Profile setup complete!');

      setTimeout(() => {
        if (user.role === 'job-seeker') {
          router.push('/job-seeker/dashboard');
        } else {
          router.push('/employer/dashboard');
        }
      }, 1000);
    } catch (error) {
      console.error('[v0] Error completing onboarding:', error);
      setLoading(false);
    }
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const totalSteps = user.role === 'job-seeker' ? 5 : 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <Badge variant="secondary" className="px-4 py-2">
              Step {step} of {totalSteps}
            </Badge>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 max-w-[100px] rounded-full transition-colors ${
                  i < step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Job Seeker Onboarding */}
        {user.role === 'job-seeker' && (
          <>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Complete Your Technical Profile
                  </CardTitle>
                  <CardDescription>
                    Upload your resume or fill in your details manually
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary group">
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <svg className="h-8 w-8 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold mb-2">Upload Resume</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            PDF, DOC, or DOCX (Max 5MB)
                          </p>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                            className="cursor-pointer"
                          />
                          {seekerData.resumeUploaded && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                              <CheckCircle className="h-4 w-4" />
                              <span>{seekerData.resumeFile?.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-secondary group">
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                          <svg className="h-8 w-8 text-secondary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold mb-2">Fill Manually</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Complete the form step by step
                          </p>
                          <Button 
                            variant="outline" 
                            className="w-full group-hover:bg-secondary group-hover:text-white group-hover:border-secondary"
                            onClick={handleNext}
                          >
                            Continue Manually
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {seekerData.resumeUploaded && (
                    <div className="flex justify-end">
                <Button onClick={handleNext} size="lg" className="bg-primary hover:bg-primary/90">
                  Continue with Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                    </div>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Your information is secure and will only be shared with potential employers</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center gap-2">
                    <BriefcaseIcon className="h-6 w-6 text-primary" />
                    Professional Information
                  </CardTitle>
                  <CardDescription>
                    Tell us about your professional background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-1.5"><BriefcaseIcon className="h-3.5 w-3.5 text-muted-foreground" />Current/Desired Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Software Engineer, Product Manager"
                      value={seekerData.title}
                      onChange={(e) => setSeekerData({ ...seekerData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredRole" className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-muted-foreground" />Preferred Role/Domain *</Label>
                    <Select
                      value={seekerData.preferredRole}
                      onValueChange={(value) => setSeekerData({ ...seekerData, preferredRole: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred domain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software-engineering">Software Engineering</SelectItem>
                        <SelectItem value="data-science">Data Science & Analytics</SelectItem>
                        <SelectItem value="product-management">Product Management</SelectItem>
                        <SelectItem value="design">UI/UX Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />Years of Experience *</Label>
                    <Select
                      value={seekerData.experience}
                      onValueChange={(value) => setSeekerData({ ...seekerData, experience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years (Entry Level)</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years (Senior)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />Preferred Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Karachi, Lahore, Remote"
                      value={seekerData.location}
                      onChange={(e) => setSeekerData({ ...seekerData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary" className="flex items-center gap-1.5"><Banknote className="h-3.5 w-3.5 text-muted-foreground" />Expected Salary Range (Monthly - PKR)</Label>
                    <Input
                      id="salary"
                      placeholder="e.g. 80,000 - 150,000 PKR"
                      value={seekerData.expectedSalary}
                      onChange={(e) => setSeekerData({ ...seekerData, expectedSalary: e.target.value })}
                    />
                  </div>

                  {!seekerData.title || !seekerData.experience || !seekerData.location || !seekerData.preferredRole ? (
                    <p className="text-sm text-destructive">* Please fill all required fields</p>
                  ) : null}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleNext} 
                      className="flex-1"
                      disabled={!seekerData.title || !seekerData.experience || !seekerData.location || !seekerData.preferredRole}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center gap-2">
                    <Wrench className="h-6 w-6 text-primary" />
                    Skills & Technologies
                  </CardTitle>
                  <CardDescription>
                    Add your key skills and areas of expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="skills" className="flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5 text-muted-foreground" />Add Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        id="skills"
                        placeholder="e.g. JavaScript, Project Management"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      />
                      <Button type="button" onClick={handleAddSkill}>Add</Button>
                    </div>
                  </div>

                  {seekerData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {seekerData.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-muted-foreground" />Professional Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell employers about yourself, your experience, and what you're looking for..."
                      rows={6}
                      value={seekerData.bio}
                      onChange={(e) => setSeekerData({ ...seekerData, bio: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Education & Experience
                  </CardTitle>
                  <CardDescription>
                    Add your educational background and work history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Education Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-muted-foreground" />Education</Label>
                    <div className="grid gap-4">
                      <Input
                        placeholder="Degree (e.g. Bachelor of Science in Computer Science)"
                        value={educationForm.degree}
                        onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                      />
                      <Input
                        placeholder="Institution (e.g. LUMS, NUST, IBA Karachi)"
                        value={educationForm.institution}
                        onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                      />
                      <Input
                        placeholder="Graduation Year (e.g. 2020)"
                        value={educationForm.year}
                        onChange={(e) => setEducationForm({ ...educationForm, year: e.target.value })}
                      />
                      <Button type="button" variant="outline" onClick={handleAddEducation}>
                        Add Education
                      </Button>
                    </div>

                    {seekerData.education.length > 0 && (
                      <div className="space-y-2">
                        {seekerData.education.map((edu, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                            <div className="font-semibold">{edu.degree}</div>
                            <div className="text-muted-foreground">{edu.institution} • {edu.year}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Work Experience Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold flex items-center gap-1.5"><BriefcaseIcon className="h-4 w-4 text-muted-foreground" />Previous Work Experience</Label>
                    <div className="grid gap-4">
                      <Input
                        placeholder="Job Title (e.g. Senior Software Engineer)"
                        value={workForm.title}
                        onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                      />
                      <Input
                        placeholder="Company (e.g. Systems Limited, Netsol)"
                        value={workForm.company}
                        onChange={(e) => setWorkForm({ ...workForm, company: e.target.value })}
                      />
                      <Input
                        placeholder="Duration (e.g. 2018 - 2022)"
                        value={workForm.duration}
                        onChange={(e) => setWorkForm({ ...workForm, duration: e.target.value })}
                      />
                      <Button type="button" variant="outline" onClick={handleAddWorkExperience}>
                        Add Work Experience
                      </Button>
                    </div>

                    {seekerData.workExperience.length > 0 && (
                      <div className="space-y-2">
                        {seekerData.workExperience.map((work, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                            <div className="font-semibold">{work.title}</div>
                            <div className="text-muted-foreground">{work.company} • {work.duration}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certifications Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold flex items-center gap-1.5"><Award className="h-4 w-4 text-muted-foreground" />Certifications (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. AWS Certified Solutions Architect"
                        value={certInput}
                        onChange={(e) => setCertInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
                      />
                      <Button type="button" onClick={handleAddCertification}>Add</Button>
                    </div>

                    {seekerData.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {seekerData.certifications.map((cert) => (
                          <Badge
                            key={cert}
                            variant="secondary"
                            className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => setSeekerData({
                              ...seekerData,
                              certifications: seekerData.certifications.filter(c => c !== cert)
                            })}
                          >
                            {cert} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    You're All Set!
                  </CardTitle>
                  <CardDescription>
                    Review your profile and start your job search
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-semibold mb-2">Job Title</div>
                      <div>{seekerData.title || 'Not specified'}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-semibold mb-2">Preferred Role</div>
                      <div className="capitalize">{seekerData.preferredRole?.replace('-', ' ') || 'Not specified'}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-semibold mb-2">Experience</div>
                      <div>{seekerData.experience || 'Not specified'}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-semibold mb-2">Skills</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {seekerData.skills.length > 0 ? (
                          seekerData.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          'No skills added'
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-semibold mb-2">Education</div>
                      <div className="space-y-2">
                        {seekerData.education.length > 0 ? (
                          seekerData.education.map((edu, index) => (
                            <div key={index} className="text-sm">
                              {edu.degree} - {edu.institution} ({edu.year})
                            </div>
                          ))
                        ) : (
                          'No education added'
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-semibold mb-2">Location</div>
                      <div>{seekerData.location || 'Not specified'}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      What's Next?
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        Browse AI-matched job recommendations
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        Apply to jobs with one click
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        Schedule and complete AI interviews
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleComplete} className="flex-1" disabled={loading}>
                      {loading ? 'Setting up...' : 'Complete & Go to Dashboard'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Employer Onboarding */}
        {user.role === 'employer' && (
          <>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    Company Information
                  </CardTitle>
                  <CardDescription>
                    Tell us about your company
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-muted-foreground" />Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="e.g. Systems Limited, Netsol Technologies"
                      value={employerData.companyName}
                      onChange={(e) => setEmployerData({ ...employerData, companyName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="flex items-center gap-1.5"><Factory className="h-3.5 w-3.5 text-muted-foreground" />Industry</Label>
                    <Select
                      value={employerData.industry}
                      onValueChange={(value) => setEmployerData({ ...employerData, industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companySize" className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" />Company Size</Label>
                    <Select
                      value={employerData.companySize}
                      onValueChange={(value) => setEmployerData({ ...employerData, companySize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empLocation" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />Company Location</Label>
                    <Input
                      id="empLocation"
                      placeholder="e.g. Karachi, Pakistan"
                      value={employerData.location}
                      onChange={(e) => setEmployerData({ ...employerData, location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-muted-foreground" />Company Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={employerData.website}
                      onChange={(e) => setEmployerData({ ...employerData, website: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleNext} size="lg">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    Complete Your Profile
                  </CardTitle>
                  <CardDescription>
                    Add a description and start hiring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-muted-foreground" />Company Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell candidates about your company, culture, and what makes it a great place to work..."
                      rows={8}
                      value={employerData.description}
                      onChange={(e) => setEmployerData({ ...employerData, description: e.target.value })}
                    />
                  </div>

                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2">What's Next?</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span>Post your first job listing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span>Review AI-matched candidates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span>Review AI interviews and hire top talent</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleComplete} className="flex-1" disabled={loading}>
                      {loading ? 'Setting up...' : 'Complete & Go to Dashboard'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
