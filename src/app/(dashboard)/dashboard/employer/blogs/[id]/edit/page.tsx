'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { blogsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blog', id], // We reuse the getBySlug logic or fetch it via a new getById endpoint. Wait, getBySlug takes slug. We might need a generic getter or we can just fetch my-blogs and find it.
    queryFn: async () => {
      // Fetch all my blogs to find this one since there is no getById endpoint for non-slugs.
      const res = await blogsAPI.getMy();
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.data) {
      const blog = data.data.find((b: any) => b.id === id);
      if (blog) {
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          coverImage: blog.coverImage || '',
          tags: blog.tags?.join(', ') || '',
        });
      } else if (!isLoading) {
        toast.error('Blog post not found');
        router.push('/dashboard/employer/blogs');
      }
    }
  }, [data, id, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateMutation = useMutation({
    mutationFn: (updateData: any) => blogsAPI.update(id as string, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
      toast.success('Blog post updated successfully');
      router.push('/dashboard/employer/blogs');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update blog post');
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

    updateMutation.mutate({
      ...formData,
      tags: tagsArray,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardContent className="p-6 space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/employer/blogs">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground">Update the details of your blog post.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Blog Details
            </CardTitle>
            <CardDescription>Make changes to your article.</CardDescription>
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
