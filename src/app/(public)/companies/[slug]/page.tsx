'use client';

import { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { companiesAPI } from '@/lib/api';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Building, MapPin, Globe, Users, Briefcase, Mail, Phone, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CompanyDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['company', slug],
    queryFn: async () => {
      const res = await companiesAPI.getBySlug(slug as string);
      return res.data;
    },
    enabled: !!slug,
  });

  const company = data?.company;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const coverImages = company?.coverImages?.length > 0 ? company.coverImages : (company?.coverImage ? [company.coverImage] : []);

  useEffect(() => {
    if (coverImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % coverImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [coverImages.length]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % coverImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + coverImages.length) % coverImages.length);

  if (isLoading) {
    return (
      <div className="container max-w-5xl px-4 py-8 space-y-8">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-col md:flex-row gap-6 items-start bg-card rounded-xl p-6 border">
          <Skeleton className="h-24 w-24 rounded-xl" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Company not found</h1>
        <Button onClick={() => router.push('/companies')}>Back to companies</Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 min-h-screen pb-12">
      {/* Cover Image & Header */}
      <div className="w-full h-48 md:h-64 bg-primary/10 relative group overflow-hidden">
        {coverImages.length > 0 ? (
          <>
            <div className="w-full h-full flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
              {coverImages.map((img: string, idx: number) => (
                <img key={idx} src={img} alt={`Cover ${idx+1}`} className="w-full h-full object-cover shrink-0" />
              ))}
            </div>
            {coverImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {coverImages.map((_: any, idx: number) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-primary/5" />
        )}
      </div>

      <div className="container max-w-5xl px-4 -mt-16 relative z-10">
        <Link href="/companies" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 bg-background/80 backdrop-blur px-3 py-1.5 rounded-full border shadow-sm transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          All Companies
        </Link>
        
        <div className="bg-background rounded-xl p-6 md:p-8 border shadow-sm flex flex-col md:flex-row gap-6 md:items-end">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-xl bg-muted border-4 border-background flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
            ) : (
              <Building className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{company.name}</h1>
              {company.verified && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Verified</Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {company.industry && (
                <div className="flex items-center gap-1.5 font-medium text-primary">
                  {company.industry}
                </div>
              )}
              {company.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </div>
              )}
              {company.size && (
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {company.size} employees
                </div>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[140px]">
            <Button className="w-full">Follow Company</Button>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl px-4 py-8">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="mb-6 w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
              About
            </TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
              Open Jobs
              {company.jobs && company.jobs.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-muted">{company.jobs.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-0">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-background rounded-xl p-6 md:p-8 border shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Company Overview</h2>
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap">
                    {company.description || 'No description provided.'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-background rounded-xl p-6 border shadow-sm space-y-4">
                  <h3 className="font-bold">Contact Info</h3>
                  <div className="space-y-3 text-sm">
                    {company.email && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${company.email}`} className="hover:text-primary transition-colors">{company.email}</a>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{company.phone}</span>
                      </div>
                    )}
                    {company.founded && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Founded in {company.founded}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="jobs" className="mt-0">
            <div className="bg-background rounded-xl p-6 md:p-8 border shadow-sm">
              <h2 className="text-xl font-bold mb-6">Open Positions</h2>
              
              {(!company.jobs || company.jobs.length === 0) ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No open positions</h3>
                  <p className="text-muted-foreground">This company doesn't have any open jobs right now.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {company.jobs.map((job: any) => (
                    <Card key={job.id} className="hover:border-primary/50 transition-colors">
                      <CardHeader className="pb-3">
                        <Link href={`/jobs/${job.slug}`}>
                          <CardTitle className="text-lg hover:text-primary transition-colors">
                            {job.title}
                          </CardTitle>
                        </Link>
                        <div className="flex items-center text-muted-foreground space-x-2 text-sm mt-2">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location} {job.isRemote && '(Remote)'}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {job.type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">{job.experienceLevel}</Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 justify-between items-center text-xs">
                        <span className="text-muted-foreground">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        <Link href={`/jobs/${job.slug}`}>
                          <Button variant="ghost" size="sm">View Job</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
