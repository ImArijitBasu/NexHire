'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { blogsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', searchTerm],
    queryFn: async () => {
      const res = await blogsAPI.getAll({ search: searchTerm });
      return res.data;
    },
  });

  const blogs = data?.data || [];

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col space-y-6 md:space-y-10 max-w-5xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Career Resources & Insights</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expert advice, industry trends, and practical tips to help you navigate your career and land your next dream job.
          </p>
        </div>

        <div className="max-w-md mx-auto w-full relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10 h-10" 
            placeholder="Search articles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="flex flex-col">
                <div className="h-48 w-full bg-muted animate-pulse rounded-t-xl" />
                <CardHeader>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                </CardHeader>
                <CardContent className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-xl border">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog: any) => (
              <Card key={blog.id} className="flex flex-col h-full hover:shadow-md transition-shadow group">
                <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-muted">
                  {blog.coverImage ? (
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-primary/40 font-bold text-4xl">{blog.title.charAt(0)}</span>
                    </div>
                  )}
                  {blog.tags && blog.tags[0] && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-background/80 text-foreground backdrop-blur-sm hover:bg-background/90">
                        {blog.tags[0]}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    <Link href={`/blogs/${blog.slug}`}>
                      {blog.title}
                      <span className="absolute inset-0" />
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {blog.excerpt || blog.content.substring(0, 150) + '...'}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-1 text-primary font-medium">
                    Read more <ArrowRight className="h-3 w-3" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
