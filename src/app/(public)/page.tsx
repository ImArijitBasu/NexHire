'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, Building2, TrendingUp, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48 bg-linear-to-b from-background to-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Find your dream job with <span className="text-primary">AI matching</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                NexHire uses advanced artificial intelligence to match your unique skills 
                and experience with the perfect opportunities.
              </p>
            </div>
            
            <div className="w-full max-w-sm space-y-2 sm:max-w-md md:max-w-2xl">
              <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8 bg-background h-10 md:h-12"
                    placeholder="Job title, keywords, or company"
                    type="search"
                  />
                </div>
                <div className="relative flex-1">
                  <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8 bg-background h-10 md:h-12"
                    placeholder="City, state, or remote"
                    type="search"
                  />
                </div>
                <Button type="button" className="h-10 md:h-12 px-8">
                  Search
                </Button>
              </form>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                <span>Popular:</span>
                <Link href="#" className="hover:text-primary transition-colors">Software Engineer</Link>
                <span>•</span>
                <Link href="#" className="hover:text-primary transition-colors">Product Manager</Link>
                <span>•</span>
                <Link href="#" className="hover:text-primary transition-colors">Remote</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-16 bg-background border-y">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Briefcase className="h-8 w-8 text-primary mb-2" />
              <h3 className="text-3xl font-bold">10k+</h3>
              <p className="text-muted-foreground font-medium">Active Jobs</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <h3 className="text-3xl font-bold">2k+</h3>
              <p className="text-muted-foreground font-medium">Companies</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="text-3xl font-bold">50k+</h3>
              <p className="text-muted-foreground font-medium">Job Seekers</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <h3 className="text-3xl font-bold">95%</h3>
              <p className="text-muted-foreground font-medium">Match Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 md:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                For Employers
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Hire the best talent faster with AI
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Post jobs, review AI-scored applications, and connect with top candidates. 
                Our matching algorithm ensures you only see the most qualified applicants.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/auth/register?role=employer">
                  <Button size="lg" className="w-full sm:w-auto">Post a Job</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">View Pricing</Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[500px] aspect-video rounded-xl bg-muted border overflow-hidden shadow-xl flex items-center justify-center">
              <p className="text-muted-foreground">Employer Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
