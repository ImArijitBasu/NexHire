'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { jobsAPI, applicationsAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';
import { ArrowLeft, MapPin, DollarSign, Clock, Building, Calendar, Share2, BookmarkPlus } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

export default function JobDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['job', slug],
    queryFn: async () => {
      const res = await jobsAPI.getBySlug(slug as string);
      return res.data;
    },
    enabled: !!slug,
  });

  const job = data?.data;

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for this job');
      router.push(`/auth/login?redirect=/jobs/${slug}`);
      return;
    }

    if (user?.role === 'EMPLOYER') {
      toast.error('Employers cannot apply for jobs');
      return;
    }

    setIsApplying(true);
    try {
      await applicationsAPI.apply({ jobId: job.id, coverLetter });
      toast.success('Application submitted successfully!');
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save this job');
      return;
    }
    try {
      await jobsAPI.toggleSave(job.id);
      toast.success('Job saved to your profile');
    } catch (err) {
      toast.error('Failed to save job');
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-24" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full mt-8" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <Button onClick={() => router.push('/jobs')}>Back to jobs</Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 min-h-screen pb-12">
      {/* Header Banner */}
      <div className="bg-background border-b">
        <div className="container max-w-5xl px-4 py-8">
          <Link href="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to jobs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">{job.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <Link href={`/companies/${job.company.slug}`} className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium text-foreground">
                  <Building className="h-4 w-4" />
                  {job.company.name}
                </Link>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location} {job.isRemote && '(Remote)'}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {job.type.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">{job.experienceLevel}</Badge>
                {job.salaryMin && (
                  <Badge variant="outline" className="flex items-center gap-1 border-green-200 bg-green-50 text-green-700 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400">
                    <DollarSign className="h-3 w-3" />
                    {job.salaryMin.toLocaleString()} - {job.salaryMax?.toLocaleString()} {job.currency}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger render={<Button size="lg" className="w-full sm:w-auto" />}>
                  Apply Now
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                      Submit your application to {job.company.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Cover Letter (Optional)</h4>
                      <Textarea 
                        placeholder="Introduce yourself and explain why you're a good fit..." 
                        className="min-h-[150px]"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleApply} disabled={isApplying}>
                      {isApplying ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="icon" onClick={handleSave} title="Save Job">
                <BookmarkPlus className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" title="Share">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-5xl px-4 py-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-background rounded-xl p-6 md:p-8 border shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">About the Role</h2>
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {job.responsibilities.map((req: string, i: number) => (
                    <li key={i} className="text-muted-foreground">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="text-muted-foreground">{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <h3 className="font-bold mb-4">About the Company</h3>
            <div className="flex items-center gap-4 mb-4">
              {job.company.logo ? (
                <div className="h-16 w-16 rounded border bg-muted flex-shrink-0">
                  <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover rounded" />
                </div>
              ) : (
                <div className="h-16 w-16 rounded border bg-muted flex items-center justify-center flex-shrink-0">
                  <Building className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <Link href={`/companies/${job.company.slug}`} className="font-semibold text-lg hover:text-primary transition-colors">
                  {job.company.name}
                </Link>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" /> {job.company.location || 'Location not specified'}
                </p>
              </div>
            </div>
            {job.company.description && (
              <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
                {job.company.description}
              </p>
            )}
            <Link href={`/companies/${job.company.slug}`}>
              <Button variant="outline" className="w-full">View Company Profile</Button>
            </Link>
          </div>

          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <h3 className="font-bold mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills && job.skills.map((skill: string, i: number) => (
                <Badge key={i} variant="secondary">{skill}</Badge>
              ))}
              {(!job.skills || job.skills.length === 0) && (
                <p className="text-sm text-muted-foreground">No specific skills listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
