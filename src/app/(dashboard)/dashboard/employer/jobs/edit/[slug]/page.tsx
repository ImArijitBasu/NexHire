'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { jobsAPI } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(1, 'Location is required'),
  type: z.string(),
  experienceLevel: z.string(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  isRemote: z.boolean(),
  requirements: z.string().min(1, 'At least one requirement is needed'),
  responsibilities: z.string().min(1, 'At least one responsibility is needed'),
  skills: z.string().min(1, 'At least one skill is needed'),
  companyId: z.string().min(1, 'Company ID is required'),
});

type JobFormValues = z.infer<typeof jobSchema>;
type JobInputValues = z.input<typeof jobSchema>;

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['job', slug],
    queryFn: async () => {
      const res = await jobsAPI.getBySlug(slug);
      return res.data;
    },
    enabled: !!slug,
  });

  const job = data?.job;

  const form = useForm<JobInputValues, any, JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      type: 'FULL_TIME',
      experienceLevel: 'MID',
      isRemote: false,
      requirements: '',
      responsibilities: '',
      skills: '',
      companyId: 'dummy-id',
    },
  });

  useEffect(() => {
    if (job) {
      form.reset({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        type: job.type || 'FULL_TIME',
        experienceLevel: job.experienceLevel || 'MID',
        isRemote: job.isRemote || false,
        salaryMin: job.salaryMin || undefined,
        salaryMax: job.salaryMax || undefined,
        requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : '',
        responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join(', ') : '',
        skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
        companyId: job.companyId || 'dummy-id',
      });
    }
  }, [job, form]);

  const onSubmit = async (data: JobFormValues) => {
    if (!job?.id) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        requirements: data.requirements ? data.requirements.split(',').map(s => s.trim()).filter(Boolean) : [],
        responsibilities: data.responsibilities ? data.responsibilities.split(',').map(s => s.trim()).filter(Boolean) : [],
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      
      await jobsAPI.update(job.id, payload);
      toast.success('Job updated successfully!');
      router.push('/dashboard/employer/jobs');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update job');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  if (!job) {
    return <div className="text-center py-12 text-muted-foreground">Job not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/employer/jobs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Job</h1>
          <p className="text-muted-foreground text-sm">Update the details of your job posting.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" {...form.register('title')} placeholder="e.g. Senior Software Engineer" />
                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select onValueChange={(val) => form.setValue('type', val ?? 'FULL_TIME')} value={form.watch('type')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select onValueChange={(val) => form.setValue('experienceLevel', val ?? 'MID')} value={form.watch('experienceLevel')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRY">Entry Level</SelectItem>
                    <SelectItem value="MID">Mid Level</SelectItem>
                    <SelectItem value="SENIOR">Senior Level</SelectItem>
                    <SelectItem value="LEAD">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" {...form.register('location')} placeholder="e.g. San Francisco, CA" />
                {form.formState.errors.location && <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>}
              </div>

              <div className="space-y-2 flex flex-col justify-end pb-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isRemote" 
                    checked={form.watch('isRemote')} 
                    onCheckedChange={(val) => form.setValue('isRemote', val)} 
                  />
                  <Label htmlFor="isRemote">This is a remote position</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary (USD)</Label>
                <Input id="salaryMin" type="number" {...form.register('salaryMin')} placeholder="e.g. 80000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary (USD)</Label>
                <Input id="salaryMax" type="number" {...form.register('salaryMax')} placeholder="e.g. 120000" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea 
                id="description" 
                {...form.register('description')} 
                placeholder="Describe the role, responsibilities, and ideal candidate..." 
                className="min-h-[150px]" 
              />
              {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (comma separated) *</Label>
              <Textarea 
                id="requirements" 
                {...form.register('requirements')} 
                placeholder="React, Node.js, 3+ years experience, etc." 
                className="min-h-[80px]" 
              />
              {form.formState.errors.requirements && <p className="text-sm text-destructive">{form.formState.errors.requirements.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities (comma separated) *</Label>
              <Textarea 
                id="responsibilities" 
                {...form.register('responsibilities')} 
                placeholder="Lead team, architecture design, etc." 
                className="min-h-[80px]" 
              />
              {form.formState.errors.responsibilities && <p className="text-sm text-destructive">{form.formState.errors.responsibilities.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma separated) *</Label>
              <Textarea 
                id="skills" 
                {...form.register('skills')} 
                placeholder="TypeScript, React, Next.js, etc." 
                className="min-h-[80px]" 
              />
              {form.formState.errors.skills && <p className="text-sm text-destructive">{form.formState.errors.skills.message}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Link href="/dashboard/employer/jobs">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
