'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { jobsAPI } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, DollarSign, Clock, Building, Briefcase, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const JOB_TYPE_FILTERS = [
  { label: 'Full-time', value: 'FULL_TIME' },
  { label: 'Part-time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Internship', value: 'INTERNSHIP' },
  { label: 'Freelance', value: 'FREELANCE' },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleType = (value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
    setPage(1); // Reset to page 1 on filter change
  };
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', debouncedSearch, location, selectedTypes, sort, page],
    queryFn: async () => {
      const params: any = { 
        search: debouncedSearch, 
        location, 
        sort, 
        page, 
        limit: 10 
      };
      if (selectedTypes.length === 1) {
        params.type = selectedTypes[0];
      }
      const res = await jobsAPI.getAll(params);
      return res.data;
    },
  });

  // Client-side filter for multiple types (backend only supports single type param)
  let jobs = data?.jobs || [];
  if (selectedTypes.length > 1) {
    jobs = jobs.filter((job: any) => selectedTypes.includes(job.type));
  }

  const pagination = data?.pagination || { page: 1, pages: 1 };

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Find your next job</h1>
            <p className="text-muted-foreground">
              Browse {pagination.total || 0} job openings from top companies.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select value={sort} onValueChange={(val) => { if (val) setSort(val); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="salary_high">Highest Salary</SelectItem>
                <SelectItem value="salary_low">Lowest Salary</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 items-center p-4 bg-muted/40 rounded-lg border">
          <div className="relative md:col-span-1 lg:col-span-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-8 bg-background" 
              placeholder="Job title, keywords, or company" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-8 bg-background" 
              placeholder="City, state, zip or remote" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Button className="w-full">Search</Button>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-5">
          {/* Sidebar Filters */}
          <div className="hidden md:block space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Job Type</h3>
              <div className="space-y-2">
                {JOB_TYPE_FILTERS.map((type) => (
                  <label key={type.value} className="flex items-center space-x-2 text-sm cursor-pointer group">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => toggleType(type.value)}
                    />
                    <span className="group-hover:text-primary transition-colors">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 lg:col-span-4 space-y-4">
            {isLoading ? (
              // Skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              <div className="p-8 text-center border rounded-lg bg-destructive/10 text-destructive">
                Failed to load jobs. Please try again later.
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center border rounded-lg bg-muted/40">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters.</p>
              </div>
            ) : (
              jobs.map((job: any) => (
                <Card key={job.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Link href={`/jobs/${job.slug}`}>
                          <CardTitle className="text-xl hover:text-primary transition-colors">
                            {job.title}
                          </CardTitle>
                        </Link>
                        <div className="flex items-center text-muted-foreground space-x-2 text-sm">
                          <Building className="h-4 w-4" />
                          <span>{job.company?.name || 'Company Name'}</span>
                          <span>•</span>
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      {job.company?.logo && (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden border">
                          <img src={job.company.logo} alt={job.company.name} className="object-cover" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {job.description?.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {job.type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.experienceLevel}
                      </Badge>
                      {job.salaryMin && job.salaryMax && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-muted-foreground">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </CardFooter>
                </Card>
              ))
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={page === p ? 'default' : 'outline'}
                      size="sm"
                      className="w-9 h-9"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
