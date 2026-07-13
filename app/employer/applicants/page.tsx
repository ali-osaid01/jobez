'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginationControls } from '@/components/pagination-controls';
import {
  useContactApplicantMutation,
  useGetApplicationsQuery,
  useLazyGetApplicationResumeQuery,
  useScheduleInterviewMutation,
  useUpdateApplicationStatusMutation,
} from '@/lib/store';
import type { ApplicationResponseData, ApplicationStatus, ScheduleInterviewRequest } from '@/lib/store/types';
import {
  AlertCircle,
  CalendarPlus,
  Clock,
  Download,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Trophy,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;
type ApplicantTab = 'all' | ApplicationStatus;

function statusColor(status: ApplicationStatus) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'interview-scheduled': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
    case 'hired': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

function statusLabel(status: ApplicationStatus) {
  return status.replace(/-/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex gap-4">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="space-y-2 w-40">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function EmptyApplicants({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

export default function ApplicantsPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<ApplicantTab>('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [schedulingApp, setSchedulingApp] = useState<ApplicationResponseData | null>(null);
  const [scheduleForm, setScheduleForm] = useState<Omit<ScheduleInterviewRequest, 'jobId' | 'applicantId'>>({
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    type: 'ai',
    meetingLink: '',
    notes: '',
  });

  const { data, isLoading, isFetching, isError, refetch } = useGetApplicationsQuery({
    page,
    limit: PAGE_SIZE,
    status: activeTab === 'all' ? null : activeTab,
    search: searchQuery || null,
    jobId,
  });
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateApplicationStatusMutation();
  const [contactApplicant, { isLoading: isContacting }] = useContactApplicantMutation();
  const [scheduleInterview, { isLoading: isScheduling }] = useScheduleInterviewMutation();
  const [getResume, { isFetching: isFetchingResume }] = useLazyGetApplicationResumeQuery();

  useEffect(() => {
    setJobId(new URLSearchParams(window.location.search).get('jobId'));
  }, []);

  const applications = data?.data ?? [];
  const counts = data?.counts;
  const totalApplications = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const handleTabChange = (value: string) => {
    setActiveTab(value as ApplicantTab);
    setPage(1);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const handleShortlist = async (application: ApplicationResponseData) => {
    try {
      await updateStatus({ id: application.id, body: { status: 'shortlisted' } }).unwrap();
      toast.success(`${application.applicantName} has been shortlisted`);
    } catch {
      toast.error('Failed to shortlist applicant');
    }
  };

  const handleReject = async (application: ApplicationResponseData) => {
    if (!rejectComment.trim()) return;
    try {
      await updateStatus({
        id: application.id,
        body: { status: 'rejected', rejectionReason: rejectComment.trim() },
      }).unwrap();
      setRejectingId(null);
      setRejectComment('');
      toast.success(`${application.applicantName} has been rejected`);
    } catch {
      toast.error('Failed to reject applicant');
    }
  };

  const handleContact = async (application: ApplicationResponseData) => {
    try {
      await contactApplicant(application.id).unwrap();
      toast.success(`Contact request sent to ${application.applicantName}`);
    } catch {
      toast.error('Failed to contact applicant');
    }
  };

  const handleDownloadResume = async (applicationId: string) => {
    try {
      const url = await getResume(applicationId).unwrap();
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      toast.error('Resume is not available for this applicant');
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
      setScheduleForm({
        scheduledDate: '',
        scheduledTime: '',
        duration: 60,
        type: 'ai',
        meetingLink: '',
        notes: '',
      });
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
              <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
              {application.matchScore !== null && application.matchScore !== undefined && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {application.matchScore}% AI Score
                </Badge>
              )}
            </div>

            {application.rejectionReason && (
              <p className="text-sm text-muted-foreground italic border-l-2 border-destructive/30 pl-3">
                {application.rejectionReason}
              </p>
            )}

            {rejectingId === application.id && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Rejection reason (required):</p>
                <Textarea
                  placeholder="Please provide a reason for rejection..."
                  value={rejectComment}
                  onChange={(event) => setRejectComment(event.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!rejectComment.trim() || isUpdatingStatus}
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
            <Badge
              className={`${
                application.latestInterviewStatus === 'completed'
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : statusColor(application.status)
              } justify-center py-1`}
            >
              {application.latestInterviewStatus === 'completed'
                ? 'Interview Completed'
                : statusLabel(application.status)}
            </Badge>

            {application.latestInterviewStatus === 'completed' && application.latestInterviewId && (
              <Button size="sm" variant="outline" className="gap-2" asChild>
                <Link href={`/employer/interviews/${application.latestInterviewId}/results`}>
                  View Details
                </Link>
              </Button>
            )}

            {application.resume && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                disabled={isFetchingResume}
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
                  disabled={isUpdatingStatus}
                  onClick={() => handleShortlist(application)}
                >
                  <UserCheck className="h-4 w-4" />
                  Shortlist
                </Button>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => setRejectingId(application.id)}>
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
                <Button size="sm" variant="outline" className="gap-2" onClick={() => setRejectingId(application.id)}>
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

  const renderApplicants = (emptyMessage: string) => {
    if (isLoading || isFetching) return <LoadingSkeleton />;
    if (applications.length === 0) return <EmptyApplicants message={emptyMessage} />;
    return applications.map((application) => <ApplicantCard key={application.id} application={application} />);
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-secondary" />
          Applicants
        </h1>
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="font-medium">Could not load applicants</p>
            <p className="text-sm text-muted-foreground">Check your connection or try again.</p>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-secondary" />
          Applicants
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and manage candidate applications
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="relative" onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or job title..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="pl-10 pr-24"
            />
            <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total', value: counts?.total ?? 0, icon: Users, color: 'text-muted-foreground' },
          { label: 'Pending', value: counts?.pending ?? 0, icon: Clock, color: 'text-yellow-600' },
          { label: 'Shortlisted', value: counts?.shortlisted ?? 0, icon: UserCheck, color: 'text-blue-600' },
          { label: 'Hired', value: counts?.hired ?? 0, icon: Trophy, color: 'text-green-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-12" /> : <p className={`text-2xl font-bold ${color}`}>{value}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({counts?.total ?? 0})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts?.pending ?? 0})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({counts?.shortlisted ?? 0})</TabsTrigger>
          <TabsTrigger value="interview-scheduled">Interviews ({counts?.interviewScheduled ?? 0})</TabsTrigger>
          <TabsTrigger value="hired">Hired ({counts?.hired ?? 0})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({counts?.rejected ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderApplicants('No applicants found')}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          {renderApplicants('No pending applications')}
        </TabsContent>
        <TabsContent value="shortlisted" className="space-y-4">
          {renderApplicants('No shortlisted applications')}
        </TabsContent>
        <TabsContent value="interview-scheduled" className="space-y-4">
          {renderApplicants('No scheduled interviews')}
        </TabsContent>
        <TabsContent value="hired" className="space-y-4">
          {renderApplicants('No hired applicants')}
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          {renderApplicants('No rejected applicants')}
        </TabsContent>
      </Tabs>

      {applications.length > 0 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          totalItems={totalApplications}
          pageSize={PAGE_SIZE}
          itemLabel="applicant"
          isLoading={isFetching}
          onPageChange={setPage}
        />
      )}

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
                    onChange={(event) => setScheduleForm((form) => ({ ...form, scheduledDate: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduleForm.scheduledTime}
                    onChange={(event) => setScheduleForm((form) => ({ ...form, scheduledTime: event.target.value }))}
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
                    onChange={(event) => setScheduleForm((form) => ({ ...form, duration: Number(event.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interview Type</Label>
                  <Select
                    value={scheduleForm.type}
                    onValueChange={(value) => setScheduleForm((form) => ({ ...form, type: value as 'ai' | 'human' }))}
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
                    onChange={(event) => setScheduleForm((form) => ({ ...form, meetingLink: event.target.value }))}
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
                  onChange={(event) => setScheduleForm((form) => ({ ...form, notes: event.target.value }))}
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
