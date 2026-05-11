'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { blogsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function NewBlogPostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => blogsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
      toast.success('Blog post created successfully');
      router.push('/dashboard/employer/blogs');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create blog post');
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    createMutation.mutate({
      ...formData,
      tags: tagsArray,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/employer/blogs">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
          <p className="text-muted-foreground">Draft a new article to share with job seekers.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Blog Details
            </CardTitle>
            <CardDescription>Fill out the details for your new blog post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. 5 Tips for Acing Your Next Interview"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                placeholder="A short summary of the article..."
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content <span className="text-destructive">*</span></Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your full article here..."
                value={formData.content}
                onChange={handleChange}
                className="min-h-[300px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  placeholder="https://example.com/image.jpg"
                  value={formData.coverImage}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="e.g. Career, Interview, Resume"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-4">
              <Link href="/dashboard/employer/blogs">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="h-4 w-4" /> 
                {isSubmitting ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
