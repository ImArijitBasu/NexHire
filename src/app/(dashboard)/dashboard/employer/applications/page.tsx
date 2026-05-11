'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { User, FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

export default function EmployerApplicationsPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['employer-applications'],
    queryFn: async () => {
      const res = await applicationsAPI.getForEmployer();
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return applicationsAPI.updateStatus(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-applications'] });
      toast.success('Application status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const applications = data?.applications || [];
  
  const filteredApps = selectedStatus === 'ALL' 
    ? applications 
    : applications.filter((app: any) => app.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200"><Clock className="mr-1 h-3 w-3"/> Pending</Badge>;
      case 'REVIEWED': return <Badge variant="secondary" className="text-blue-600 bg-blue-50 border-blue-200"><Eye className="mr-1 h-3 w-3"/> Reviewed</Badge>;
      case 'SHORTLISTED': return <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30"><CheckCircle className="mr-1 h-3 w-3"/> Shortlisted</Badge>;
      case 'REJECTED': return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-transparent"><XCircle className="mr-1 h-3 w-3"/> Rejected</Badge>;
      case 'ACCEPTED': return <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200 border-transparent"><CheckCircle className="mr-1 h-3 w-3"/> Accepted</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
          <p className="text-muted-foreground">Review and manage candidates for your jobs.</p>
        </div>
        <div className="w-full sm:w-48">
          <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val ?? 'ALL')}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Applicants</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
              <UsersIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p>No applicants found matching this status.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredApps.map((app: any) => (
                <div key={app.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border shrink-0">
                      {app.user?.image ? (
                         <img src={app.user.image} alt="User" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{app.user?.name || 'Anonymous User'}</h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Applied for <span className="font-medium text-foreground">{app.job?.title}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(app.createdAt), 'MMM d, yyyy')} • {app.user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Dialog>
                      <DialogTrigger
                        render={<Button variant="outline" size="sm" className="w-full sm:w-auto" />}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Application
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Application Details</DialogTitle>
                          <DialogDescription>
                            Candidate: {app.user?.name} | Job: {app.job?.title}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {app.coverLetter ? (
                            <div className="space-y-2">
                              <h4 className="font-medium">Cover Letter</h4>
                              <div className="p-4 bg-muted/50 rounded-md text-sm whitespace-pre-wrap">
                                {app.coverLetter}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No cover letter provided.</p>
                          )}
                          
                          {/* Placeholder for Resume logic */}
                          <div className="p-4 border rounded-md flex justify-between items-center bg-background">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-blue-500" />
                              <div>
                                <p className="font-medium text-sm">Resume.pdf</p>
                                <p className="text-xs text-muted-foreground">Not uploaded</p>
                              </div>
                            </div>
                            <Button variant="secondary" size="sm" disabled>Download</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Select 
                      value={app.status} 
                      onValueChange={(val) => handleStatusUpdate(app.id, val)}
                    >
                      <SelectTrigger className="w-full sm:w-[140px] h-9">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REVIEWED">Reviewed</SelectItem>
                        <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
