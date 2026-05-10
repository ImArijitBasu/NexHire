'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store';
import { authAPI, generalAPI } from '@/lib/api';
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
  const { user, setAuth } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [skills, setSkills] = useState<string[]>(['JavaScript', 'React', 'TypeScript', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      title: '',
      location: '',
      github: '',
      linkedin: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('name', user.name || '');
      form.setValue('email', user.email || '');
      form.setValue('bio', user.bio || '');
      form.setValue('location', user.location || '');
      if (user.skills && user.skills.length > 0) setSkills(user.skills);
    }
  }, [user, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'resume') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'avatar') setIsUploadingAvatar(true);
    else setIsUploadingResume(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await generalAPI.uploadFile(formData);
      
      if (uploadRes.data.success) {
        const oldFile = type === 'avatar' ? user?.image : user?.resume;
        if (oldFile) {
          try { await generalAPI.deleteFile(oldFile); } catch (e) {}
        }

        const updateData = type === 'avatar' 
          ? { image: uploadRes.data.url }
          : { resume: uploadRes.data.url };
          
        const updateRes = await authAPI.updateProfile(updateData);
        if (updateRes.data.success) {
          setAuth(updateRes.data.user, localStorage.getItem('nexhire_token') || '');
          toast.success(`${type === 'avatar' ? 'Profile picture' : 'Resume'} updated!`);
        }
      }
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      if (type === 'avatar') setIsUploadingAvatar(false);
      else setIsUploadingResume(false);
    }
  };

  const handleRemoveFile = async (type: 'avatar' | 'resume') => {
    const fileUrl = type === 'avatar' ? user?.image : user?.resume;
    if (!fileUrl) return;

    if (type === 'avatar') setIsUploadingAvatar(true);
    else setIsUploadingResume(true);

    try {
      await generalAPI.deleteFile(fileUrl);
      const updateData = type === 'avatar' ? { image: '' } : { resume: '' };
      const updateRes = await authAPI.updateProfile(updateData);
      if (updateRes.data.success) {
        setAuth(updateRes.data.user, localStorage.getItem('nexhire_token') || '');
        toast.success(`${type === 'avatar' ? 'Profile picture' : 'Resume'} removed!`);
      }
    } catch (error) {
      toast.error(`Failed to remove ${type}`);
    } finally {
      if (type === 'avatar') setIsUploadingAvatar(false);
      else setIsUploadingResume(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        bio: data.bio,
        location: data.location,
        skills: skills,
        // Optional parsing of title/github/linkedin into website/bio fields or adding to API
      };
      const res = await authAPI.updateProfile(payload);
      if (res.data.success) {
        setAuth(res.data.user, localStorage.getItem('nexhire_token') || '');
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
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
                {isUploadingAvatar ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : user?.image ? (
                  <img src={user.image} alt={user.name || 'User'} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-muted-foreground" />
                )}
                <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-colors">
                  <Upload className="h-6 w-6 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'avatar')} disabled={isUploadingAvatar} />
                </label>
              </div>
              <div className="flex flex-col gap-2 mt-2 w-full max-w-[200px]">
                {user?.image && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={isUploadingAvatar} onClick={() => handleRemoveFile('avatar')}>
                    <X className="h-4 w-4 mr-2" />
                    Remove Picture
                  </Button>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  Click the image to upload a new avatar. Recommended size: 256x256px.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload your latest resume to apply for jobs faster.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.resume ? (
                <div className="p-4 border rounded-lg bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                    <div className="truncate">
                      <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline truncate block">
                        My_Resume.pdf
                      </a>
                      <p className="text-xs text-muted-foreground">Uploaded</p>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveFile('resume')} disabled={isUploadingResume} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="p-4 border border-dashed rounded-lg flex flex-col items-center justify-center text-center space-y-2 bg-muted/10">
                  <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">No resume uploaded yet</p>
                </div>
              )}
              <Button variant="outline" className="w-full relative" disabled={isUploadingResume}>
                {isUploadingResume ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {isUploadingResume ? 'Uploading...' : (user?.resume ? 'Upload New Resume' : 'Upload Resume')}
                <input type="file" accept=".pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'resume')} disabled={isUploadingResume} />
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
