'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useContactApplicantMutation,
  useScheduleInterviewMutation,
  useLazyGetApplicationResumeQuery,
} from '@/lib/store';
import type { ApplicationResponseData, ScheduleInterviewRequest } from '@/lib/store/types';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Phone,
  Sparkles,
  Clock,
  Trophy,
  AlertCircle,
  CalendarPlus,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ApplicantsPage() {
  const searchParams = useSearchParams();
  const jobIdFilter = searchParams.get('jobId') ?? undefined;

  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  // Schedule interview dialog state
  const [schedulingApp, setSchedulingApp] = useState<ApplicationResponseData | null>(null);
    const [scheduleForm, setScheduleForm] = useState<Omit<ScheduleInterviewRequest, 'jobId' | 'applicantId'>>({
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    type: 'ai',
    meetingLink: '',
    notes: '',
  });

  const { data, isLoading, isError } = useGetApplicationsQuery(
    jobIdFilter ? { jobId: jobIdFilter } : undefined,
  );

  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
  const [contactApplicant, { isLoading: isContacting }] = useContactApplicantMutation();
  const [scheduleInterview, { isLoading: isScheduling }] = useScheduleInterviewMutation();
  const [triggerGetResume] = useLazyGetApplicationResumeQuery();

  const applications = data?.data ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'interview-scheduled': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'hired': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filterByStatus = (status: string | null) => {
    const byStatus = status ? applications.filter(app => app.status === status) : applications;
    if (!searchQuery) return byStatus;
    return byStatus.filter(app =>
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleShortlist = async (app: ApplicationResponseData) => {
    try {
      await updateStatus({ id: app.id, body: { status: 'shortlisted' } }).unwrap();
      toast.success(`${app.applicantName} has been shortlisted`);
    } catch {
      toast.error('Failed to shortlist applicant');
    }
  };

  const handleReject = async (app: ApplicationResponseData) => {
    if (!rejectComment.trim()) return;
    try {
      await updateStatus({ id: app.id, body: { status: 'rejected', rejectionReason: rejectComment } }).unwrap();
      toast.success(`${app.applicantName} has been rejected`);
      setRejectingId(null);
      setRejectComment('');
    } catch {
      toast.error('Failed to reject applicant');
    }
  };

  const handleContact = async (app: ApplicationResponseData) => {
    try {
      await contactApplicant(app.id).unwrap();
      toast.success(`Contact request sent to ${app.applicantName}`);
    } catch {
      toast.error('Failed to send contact request');
    }
  };

  const handleDownloadResume = async (appId: string) => {
    try {
      const result = await triggerGetResume(appId).unwrap();
      window.open(result.url, '_blank');
    } catch {
      toast.error('Failed to get resume download link');
    }
  };

  const handleScheduleSubmit = async () => {
    if (!schedulingApp) return;
    if (!scheduleForm.scheduledDate || !scheduleForm.scheduledTime) {
      toast.error('Please fill in date and time');
      return;
    }
    try {
      await scheduleInterview({
        jobId: schedulingApp.jobId,
        applicantId: schedulingApp.applicantId,
        ...scheduleForm,
      }).unwrap();
      toast.success(`Interview scheduled for ${schedulingApp.applicantName}`);
      setSchedulingApp(null);
    } catch {
      toast.error('Failed to schedule interview');
    }
  };

  const ApplicantCard = ({ application }: { application: ApplicationResponseData }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{application.applicantName}</CardTitle>
                <p className="text-muted-foreground mt-1">{application.applicantEmail}</p>
                <p className="text-sm text-muted-foreground">Applied for: {application.jobTitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>Applied {application.appliedDate}</span>
              {application.matchScore && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {application.matchScore}% AI Score
                </Badge>
              )}
            </div>

            {/* Reject comment form */}
            {rejectingId === application.id && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Rejection reason (required):</p>
                <Textarea
                  placeholder="Please provide a reason for rejection..."
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!rejectComment.trim() || isUpdating}
                    onClick={() => handleReject(application)}
                  >
                    Confirm Rejection
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setRejectingId(null); setRejectComment(''); }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 md:w-48">
            <Badge className={`${getStatusColor(application.status)} justify-center py-1`}>
              {application.status.replace('-', ' ').toUpperCase()}
            </Badge>

            {application.resume && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => handleDownloadResume(application.id)}
              >
                <Download className="h-4 w-4" />
                Download Resume
              </Button>
            )}

            {application.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="gap-2 bg-secondary hover:bg-secondary/90"
                  disabled={isUpdating}
                  onClick={() => handleShortlist(application)}
                >
                  <UserCheck className="h-4 w-4" />
                  Shortlist
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setRejectingId(application.id)}
                >
                  <UserX className="h-4 w-4" />
                  Reject
                </Button>
              </>
            )}

            {application.status === 'shortlisted' && (
              <>
                <Button
                  size="sm"
                  className="gap-2 bg-secondary hover:bg-secondary/90"
                  disabled={isContacting}
                  onClick={() => handleContact(application)}
                >
                  <Phone className="h-4 w-4" />
                  Contact Candidate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setSchedulingApp(application)}
                >
                  <CalendarPlus className="h-4 w-4" />
                  Schedule Interview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setRejectingId(application.id)}
                >
                  <UserX className="h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  const counts = data?.counts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-secondary" />
          Applicants
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and manage candidate applications
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {isError && (
        <Card>
          <CardContent className="py-8 flex flex-col items-center gap-2 text-center text-muted-foreground">
            <AlertCircle className="h-6 w-6 text-destructive" />
            Failed to load applicants. Please try again.
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm text-muted-foreground">Total</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <p className="text-2xl font-bold">{counts?.total ?? applications.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm text-muted-foreground">Pending</p>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <p className="text-2xl font-bold text-yellow-600">
                {counts?.pending ?? filterByStatus('pending').length}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm text-muted-foreground">Shortlisted</p>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <p className="text-2xl font-bold text-blue-600">
                {counts?.shortlisted ?? filterByStatus('shortlisted').length}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm text-muted-foreground">Hired</p>
            <Trophy className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <p className="text-2xl font-bold text-green-600">
                {filterByStatus('hired').length}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Applicants List with Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({filterByStatus(null).length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterByStatus('pending').length})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({filterByStatus('shortlisted').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </>
          ) : filterByStatus(null).length > 0 ? (
            filterByStatus(null).map(app => (
              <ApplicantCard key={app.id} application={app} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No applications found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterByStatus('pending').length > 0 ? (
            filterByStatus('pending').map(app => (
              <ApplicantCard key={app.id} application={app} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No pending applications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="shortlisted" className="space-y-4">
          {filterByStatus('shortlisted').length > 0 ? (
            filterByStatus('shortlisted').map(app => (
              <ApplicantCard key={app.id} application={app} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <UserCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No shortlisted applications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Schedule Interview Dialog */}
      <Dialog open={!!schedulingApp} onOpenChange={(open) => !open && setSchedulingApp(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-secondary" />
              Schedule Interview
            </DialogTitle>
          </DialogHeader>

          {schedulingApp && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Scheduling for <strong>{schedulingApp.applicantName}</strong> — {schedulingApp.jobTitle}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduleForm.scheduledDate}
                    onChange={(e) => setScheduleForm(f => ({ ...f, scheduledDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduleForm.scheduledTime}
                    onChange={(e) => setScheduleForm(f => ({ ...f, scheduledTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={15}
                    step={15}
                    value={scheduleForm.duration}
                    onChange={(e) => setScheduleForm(f => ({ ...f, duration: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interview Type</Label>
                  <Select
                    value={scheduleForm.type}
                    onValueChange={(v) => setScheduleForm(f => ({ ...f, type: v as 'ai' | 'human' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI Interview</SelectItem>
                      <SelectItem value="human">Human Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {scheduleForm.type === 'human' && (
                <div className="space-y-2">
                  <Label htmlFor="meeting-link">Meeting Link (optional)</Label>
                  <Input
                    id="meeting-link"
                    placeholder="https://meet.google.com/..."
                    value={scheduleForm.meetingLink}
                    onChange={(e) => setScheduleForm(f => ({ ...f, meetingLink: e.target.value }))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any instructions for the candidate..."
                  rows={3}
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSchedulingApp(null)}>
              Cancel
            </Button>
            <Button
              className="bg-secondary hover:bg-secondary/90"
              disabled={isScheduling}
              onClick={handleScheduleSubmit}
            >
              {isScheduling ? 'Scheduling...' : 'Schedule Interview'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
