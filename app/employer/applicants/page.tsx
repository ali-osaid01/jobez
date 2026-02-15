'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockApplications } from '@/lib/mock-data';
import { Textarea } from '@/components/ui/textarea';
import { Users, Search, UserCheck, UserX, Download, Phone, Sparkles, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ApplicantsPage() {
  const [applications] = useState(mockApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'contacted': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'hired': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filterByStatus = (status: string | null) => {
    const filtered = status ? applications.filter(app => app.status === status) : applications;
    if (!searchQuery) return filtered;
    return filtered.filter(app =>
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const ApplicantCard = ({ application }: { application: typeof applications[0] }) => (
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
                    disabled={!rejectComment.trim()}
                    onClick={() => { toast.success(`${application.applicantName} has been rejected`); setRejectingId(null); setRejectComment(''); }}
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
            <Button size="sm" variant="outline" className="gap-2" onClick={() => toast.success('Resume downloaded successfully')}>
              <Download className="h-4 w-4" />
              Download Resume
            </Button>
            {application.status === 'pending' && (
              <>
                <Button size="sm" className="gap-2 bg-secondary hover:bg-secondary/90" onClick={() => toast.success(`${application.applicantName} has been shortlisted`)}>
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
                <Button size="sm" className="gap-2 bg-secondary hover:bg-secondary/90" onClick={() => toast.success(`Contact request sent to ${application.applicantName}`)}>
                  <Phone className="h-4 w-4" />
                  Contact Candidate
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Total</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{applications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {filterByStatus('pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {filterByStatus('shortlisted').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Hired</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {filterByStatus('hired').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applicants List with Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterByStatus('pending').length})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({filterByStatus('shortlisted').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filterByStatus(null).map(app => (
            <ApplicantCard key={app.id} application={app} />
          ))}
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
    </div>
  );
}
