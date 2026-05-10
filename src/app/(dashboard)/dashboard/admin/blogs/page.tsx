'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Eye, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      try { const res = await blogsAPI.getAll(); return res.data; }
      catch { return { data: [] }; }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogsAPI.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-blogs'] }); toast.success('Blog deleted'); },
    onError: () => toast.error('Failed to delete blog'),
  });

  const blogs = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" /> Blog Management
        </h1>
        <p className="text-muted-foreground">Manage all blog posts and articles.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>All Blog Posts ({blogs.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No blog posts found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog: any) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{blog.title}</TableCell>
                      <TableCell className="text-muted-foreground">{blog.author?.name || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={blog.published ? 'default' : 'secondary'}>
                          {blog.published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-1 text-muted-foreground"><Eye className="h-3 w-3" />{blog.views || 0}</TableCell>
                      <TableCell className="text-muted-foreground">{blog.createdAt ? format(new Date(blog.createdAt), 'MMM d, yyyy') : '—'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/blogs/${blog.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="h-4 w-4" /></Button>
                          </Link>
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                            title="Delete this blog post?"
                            description="This will permanently remove the blog post and all its content. This action cannot be undone."
                            actionLabel="Delete Post"
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
