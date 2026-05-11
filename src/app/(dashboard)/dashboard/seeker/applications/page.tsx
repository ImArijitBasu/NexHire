'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { applicationsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Building, MapPin, ExternalLink, Clock, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function SeekerApplicationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const res = await applicationsAPI.getMy();
      return res.data;
    },
  });

  const applications = data?.applications || [];

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">Track the status of jobs you've applied to.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                  <FileTextIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No applications yet</h3>
              <p className="mb-4">You haven't applied to any jobs. Start exploring opportunities!</p>
              <Link href="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {applications.map((app: any) => (
                <div key={app.id} className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    {app.job.company.logo ? (
                      <div className="h-16 w-16 rounded border bg-muted flex items-center justify-center overflow-hidden">
                        <img src={app.job.company.logo} alt={app.job.company.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded border bg-muted flex items-center justify-center">
                        <Building className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                      <div>
                        <Link href={`/jobs/${app.job.slug}`} className="hover:underline">
                          <h3 className="font-semibold text-lg">{app.job.title}</h3>
                        </Link>
                        <div className="flex items-center text-sm text-muted-foreground mt-1 gap-3">
                          <span className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5" />
                            {app.job.company.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {app.job.location}
                          </span>
                        </div>
                      </div>
                      <div>
                        {getStatusBadge(app.status)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs pt-2">
                      <Badge variant="secondary" className="bg-muted">Applied: {format(new Date(app.createdAt), 'MMM d, yyyy')}</Badge>
                      <Badge variant="secondary" className="bg-muted capitalize">{app.job.type.replace('_', ' ')}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:items-start mt-4 sm:mt-0">
                     <Link href={`/jobs/${app.job.slug}`}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Job
                        </Button>
                     </Link>
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

function FileTextIcon(props: any) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}
