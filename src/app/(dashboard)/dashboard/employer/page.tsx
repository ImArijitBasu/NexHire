'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { adminAPI } from '@/lib/api'; // Using admin API for stats, or create a specific employer stats endpoint
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, TrendingUp, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmployerDashboard() {
  const { user } = useAuthStore();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['employer-stats'],
    queryFn: async () => {
      // Temporarily use adminAPI.getEmployerStats or mock if not available
      try {
        const res = await adminAPI.getEmployerStats();
        return res.data;
      } catch (e) {
        return { data: { activeJobs: 0, totalApplicants: 0, newApplicants: 0 } };
      }
    },
  });

  const stats = statsData?.data || { activeJobs: 0, totalApplicants: 0, newApplicants: 0 };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
        <p className="text-muted-foreground">Manage your company profile, jobs, and applicants.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalApplicants}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Applicants (7d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{stats.newApplicants}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company Profile</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-amber-500">Incomplete</div>
            <p className="text-xs text-muted-foreground mt-1">Add logo & details</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              You don't have any recent activity. 
              <div className="mt-4">
                <a href="/dashboard/employer/jobs" className="text-primary hover:underline">
                  Post your first job
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
