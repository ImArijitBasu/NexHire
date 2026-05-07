'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { applicationsAPI, jobsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Bookmark, BrainCircuit, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SeekerDashboard() {
  const { user } = useAuthStore();

  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const res = await applicationsAPI.getMy();
      return res.data;
    },
  });

  const { data: savedData, isLoading: savedLoading } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: async () => {
      const res = await jobsAPI.getSaved();
      return res.data;
    },
  });

  const applicationsCount = appsData?.data?.length || 0;
  const savedJobsCount = savedData?.data?.length || 0;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here is an overview of your job search activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{applicationsCount}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {savedLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{savedJobsCount}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground mt-1">Feature coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <BrainCircuit className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Recommendations ready</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : applicationsCount === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                You haven't applied to any jobs yet.
              </div>
            ) : (
              <div className="space-y-4">
                {appsData.data.slice(0, 5).map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{app.job.title}</p>
                      <p className="text-sm text-muted-foreground">{app.job.company.name}</p>
                    </div>
                    <div className="text-sm px-2 py-1 bg-muted rounded capitalize">
                      {app.status.toLowerCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Suggested Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center gap-3 text-primary">
                <BrainCircuit className="h-5 w-5" />
                <span className="font-semibold">Enhance your resume</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Use our AI analyzer to get instant feedback on your resume and match better with top employers.
              </p>
              <a href="/dashboard/seeker/ai-tools" className="text-sm font-medium text-primary hover:underline">
                Try it now &rarr;
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
