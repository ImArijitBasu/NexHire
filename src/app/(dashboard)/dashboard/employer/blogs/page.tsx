'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import Link from 'next/link';

export default function EmployerBlogsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-blogs'],
    queryFn: async () => {
      try {
        const res = await blogsAPI.getMy();
        return res.data;
      } catch (error) {
        return { data: [] };
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
      toast.success('Blog post deleted successfully');
    },
    onError: () => toast.error('Failed to delete blog post'),
  });

  const blogs = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" /> My Blog Posts
          </h1>
          <p className="text-muted-foreground">Manage your articles and career resources.</p>
        </div>
        <Link href="/dashboard/employer/blogs/new">
          <Button className="w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4" /> Create New Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Posts ({blogs.length})</CardTitle>
          <CardDescription>All the articles you have authored.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground mb-4">Start sharing your insights with the community.</p>
              <Link href="/dashboard/employer/blogs/new">
                <Button>Create Your First Post</Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog: any) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium max-w-[200px] sm:max-w-[300px] truncate">
                        {blog.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant={blog.published ? 'default' : 'secondary'}>
                          {blog.published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" /> {blog.views || 0}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {blog.createdAt ? format(new Date(blog.createdAt), 'MMM d, yyyy') : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {blog.published && (
                            <Link href={`/blogs/${blog.slug}`} target="_blank">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/dashboard/employer/blogs/${blog.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                            title="Delete this blog post?"
                            description="This will permanently remove the blog post. This action cannot be undone."
                            actionLabel="Delete"
                            onConfirm={() => deleteMutation.mutate(blog.id)}
                          />
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
