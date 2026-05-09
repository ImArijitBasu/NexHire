'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { adminAPI } from '@/lib/api'; // Using admin API for stats, or create a specific employer stats endpoint
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, TrendingUp, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Applications Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { month: 'Jan', applications: 4 },
                  { month: 'Feb', applications: 7 },
                  { month: 'Mar', applications: 12 },
                  { month: 'Apr', applications: 9 },
                  { month: 'May', applications: stats.totalApplicants || 15 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--card-foreground))' }} />
                  <Bar dataKey="applications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/dashboard/employer/jobs/create" className="block">
              <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-muted transition-colors flex items-center gap-3 text-sm font-medium">
                <Briefcase className="h-4 w-4 text-primary" /> Post a New Job
              </button>
            </a>
            <a href="/dashboard/employer/applications" className="block">
              <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-muted transition-colors flex items-center gap-3 text-sm font-medium">
                <Users className="h-4 w-4 text-primary" /> Review Applicants
              </button>
            </a>
            <a href="/dashboard/employer/company" className="block">
              <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-muted transition-colors flex items-center gap-3 text-sm font-medium">
                <Activity className="h-4 w-4 text-primary" /> Update Company Profile
              </button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
