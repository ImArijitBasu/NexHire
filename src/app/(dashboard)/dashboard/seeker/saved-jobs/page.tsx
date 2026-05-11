'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { jobsAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Building, MapPin, Briefcase, DollarSign, Bookmark, BookmarkX, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SavedJobsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: async () => {
      const res = await jobsAPI.getSaved();
      return res.data;
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (jobId: string) => {
      return jobsAPI.toggleSave(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      toast.success('Job removed from saved list');
    },
    onError: () => {
      toast.error('Failed to unsave job');
    },
  });

  const savedJobs = data?.savedJobs || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bookmark className="h-7 w-7 text-primary" />
          Saved Jobs
        </h1>
        <p className="text-muted-foreground">Jobs you&apos;ve bookmarked for later. Apply when you&apos;re ready!</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="mb-4 flex justify-center">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
                  <Bookmark className="h-10 w-10 text-muted-foreground/40" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No saved jobs yet</h3>
              <p className="mb-4 max-w-md mx-auto">
                When you find a job you like, click the bookmark icon to save it here for later.
              </p>
              <Link href="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {savedJobs.map((item: any) => {
                const job = item.job || item;
                return (
                  <div key={item.id || job.id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Company Logo */}
                      <div className="shrink-0">
                        {job.company?.logo ? (
                          <div className="h-14 w-14 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                            <img src={job.company.logo} alt={job.company.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-14 w-14 rounded-lg border bg-muted flex items-center justify-center">
                            <Building className="h-7 w-7 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Job Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                          <div>
                            <Link href={`/jobs/${job.slug}`} className="hover:underline">
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                            </Link>
                            <div className="flex items-center text-sm text-muted-foreground mt-1 gap-3">
                              <span className="flex items-center gap-1">
                                <Building className="h-3.5 w-3.5" />
                                {job.company?.name || 'Company'}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {job.description?.substring(0, 120)}...
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <Briefcase className="h-3 w-3" />
                            {job.type?.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {job.experienceLevel}
                          </Badge>
                          {job.salaryMin && job.salaryMax && (
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                              <DollarSign className="h-3 w-3" />
                              ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                            </Badge>
                          )}
                          {item.createdAt && (
                            <Badge variant="secondary" className="bg-muted text-xs">
                              Saved: {format(new Date(item.createdAt), 'MMM d, yyyy')}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-start gap-2">
                        <Link href={`/jobs/${job.slug}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Remove from saved"
                          onClick={() => unsaveMutation.mutate(job.id)}
                          disabled={unsaveMutation.isPending}
                        >
                          <BookmarkX className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
