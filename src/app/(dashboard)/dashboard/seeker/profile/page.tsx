'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Upload, FileText, CheckCircle2, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  bio: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SeekerProfilePage() {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>(['JavaScript', 'React', 'TypeScript', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: 'Passionate software engineer looking for new opportunities in frontend development.',
      title: 'Frontend Developer',
      location: 'San Francisco, CA',
      github: 'https://github.com/',
      linkedin: 'https://linkedin.com/in/',
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('name', user.name || '');
      form.setValue('email', user.email || '');
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    // In a real application, this would call an API endpoint like /users/me
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and resume.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Avatar & Resume */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="h-32 w-32 rounded-full border-4 border-muted bg-muted flex items-center justify-center overflow-hidden relative group">
                {user?.image ? (
                  <img src={user.image} alt={user.name || 'User'} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-colors">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Click the image to upload a new avatar. Recommended size: 256x256px.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload your latest resume to apply for jobs faster.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium">John_Doe_Resume.pdf</p>
                    <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Resume
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Form */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact details and professional summary.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" {...form.register('name')} />
                    {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" {...form.register('email')} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" {...form.register('title')} placeholder="e.g. Senior Product Designer" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...form.register('location')} placeholder="e.g. New York, NY" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Summary</Label>
                  <Textarea 
                    id="bio" 
                    {...form.register('bio')} 
                    placeholder="Briefly describe your experience and what you're looking for..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub Profile</Label>
                    <Input id="github" {...form.register('github')} placeholder="https://github.com/username" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input id="linkedin" {...form.register('linkedin')} placeholder="https://linkedin.com/in/username" />
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4 mt-6">
                  <div>
                    <Label className="mb-2 block">Skills</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                          {skill}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <Input 
                      placeholder="Type a skill and press Enter..." 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleAddSkill}
                      onBlur={() => {
                        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                          setSkills([...skills, newSkill.trim()]);
                          setNewSkill('');
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
