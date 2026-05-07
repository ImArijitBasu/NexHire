'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Briefcase, Trash2, ExternalLink, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminJobsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-jobs', search],
    queryFn: async () => {
      try {
        const params: any = {};
        if (search) params.search = search;
        const res = await adminAPI.getJobs(params);
        return res.data;
      } catch {
        return { data: [] };
      }
    },
  });

  const jobs = data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-transparent">Active</Badge>;
      case 'CLOSED':
        return <Badge variant="secondary">Closed</Badge>;
      case 'DRAFT':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Briefcase className="h-7 w-7 text-primary" />
          Job Management
        </h1>
        <p className="text-muted-foreground">View and manage all job postings across the platform.</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or company..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Jobs ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No jobs found matching your criteria.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job: any) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-xs text-muted-foreground">{job.location}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {job.company?.logo ? (
                            <div className="h-6 w-6 rounded overflow-hidden border flex-shrink-0">
                              <img src={job.company.logo} alt="" className="h-full w-full object-cover" />
                            </div>
                          ) : (
                            <Building className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">{job.company?.name || '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {job.type?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {job.createdAt ? format(new Date(job.createdAt), 'MMM d, yyyy') : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/jobs/${job.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="View Job">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
