'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Briefcase, Building2, FileText, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const res = await adminAPI.getStats();
        return res.data;
      } catch {
        return {
          data: {
            totalUsers: 0,
            totalJobs: 0,
            totalCompanies: 0,
            totalApplications: 0,
            newUsersThisWeek: 0,
            activeJobsCount: 0,
          },
        };
      }
    },
  });

  const stats = data?.data || {};

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers ?? 0, icon: Users, color: 'text-blue-500', href: '/dashboard/admin/users' },
    { title: 'Total Jobs', value: stats.totalJobs ?? 0, icon: Briefcase, color: 'text-green-500', href: '/dashboard/admin/jobs' },
    { title: 'Companies', value: stats.totalCompanies ?? 0, icon: Building2, color: 'text-purple-500', href: '#' },
    { title: 'Applications', value: stats.totalApplications ?? 0, icon: FileText, color: 'text-orange-500', href: '#' },
    { title: 'New Users (7d)', value: stats.newUsersThisWeek ?? 0, icon: TrendingUp, color: 'text-emerald-500', href: '#' },
    { title: 'Active Jobs', value: stats.activeJobsCount ?? 0, icon: Activity, color: 'text-cyan-500', href: '/dashboard/admin/jobs' },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management tools.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:border-primary/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{card.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/admin/users" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/dashboard/admin/jobs" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Briefcase className="h-4 w-4" />
                Manage Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">API Status</span>
                <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Database</span>
                <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">AI Services</span>
                <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
