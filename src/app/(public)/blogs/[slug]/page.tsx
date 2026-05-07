'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { blogsAPI } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await blogsAPI.getBySlug(slug as string);
      return res.data;
    },
    enabled: !!slug,
  });

  const blog = data?.data;

  if (isLoading) {
    return (
      <div className="container max-w-4xl px-4 py-12 space-y-8">
        <Skeleton className="h-8 w-24" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link href="/blogs">
          <Button>Back to all articles</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-muted/30 border-b">
        <div className="container max-w-4xl px-4 py-10 md:py-16">
          <Link href="/blogs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to articles
          </Link>
          
          <div className="space-y-6">
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              {blog.title}
            </h1>
            
            {blog.excerpt && (
              <p className="text-xl text-muted-foreground max-w-3xl">
                {blog.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {blog.author?.image ? (
                    <img src={blog.author.image} alt={blog.author.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="font-medium text-foreground">{blog.author?.name || 'NexHire Team'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                5 min read
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl px-4 py-12">
        {blog.coverImage && (
          <div className="rounded-xl overflow-hidden mb-12 shadow-lg border">
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Main Article */}
          <article className="flex-1">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap 
                prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 
                prose-img:rounded-xl"
            >
              {/* Very basic rendering for now, ideally use a markdown parser if content is markdown */}
              {blog.content}
            </div>
            
            <div className="mt-12 pt-8 border-t flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Published on {format(new Date(blog.createdAt), 'MMM d, yyyy')}
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" /> Share Article
              </Button>
            </div>
          </article>
          
          {/* Sidebar / Author Info */}
          <aside className="w-full md:w-64 space-y-8 hidden md:block">
            <div className="bg-muted/50 rounded-xl p-6 border sticky top-24">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">About the Author</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                   {blog.author?.image ? (
                    <img src={blog.author.image} alt={blog.author.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{blog.author?.name || 'NexHire Team'}</div>
                  <div className="text-xs text-muted-foreground">Career Expert</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Dedicated to helping professionals navigate their career paths and find meaningful work.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
