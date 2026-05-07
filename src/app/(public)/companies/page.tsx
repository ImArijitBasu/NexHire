'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { companiesAPI } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Building, Globe, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['companies', searchTerm],
    queryFn: async () => {
      const res = await companiesAPI.getAll({ search: searchTerm });
      return res.data;
    },
  });

  const companies = data?.data || [];

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col space-y-6 md:space-y-8">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Discover Top Companies</h1>
          <p className="text-muted-foreground text-lg">
            Find the perfect workplace. Browse companies hiring right now and learn about their culture, benefits, and open roles.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto w-full relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            className="pl-10 h-12 text-base rounded-full bg-muted/40" 
            placeholder="Search companies by name or industry" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Company Listings */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex flex-col h-full">
                <CardHeader className="text-center pb-2">
                  <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardHeader>
                <CardContent className="mt-auto space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full p-8 text-center border rounded-lg bg-destructive/10 text-destructive">
              Failed to load companies. Please try again later.
            </div>
          ) : companies.length === 0 ? (
            <div className="col-span-full p-12 text-center border rounded-lg bg-muted/40">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria.</p>
            </div>
          ) : (
            companies.map((company: any) => (
              <Link href={`/companies/${company.slug}`} key={company.id} className="block group h-full">
                <Card className="h-full flex flex-col hover:border-primary/50 transition-all hover:shadow-md">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto h-20 w-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden border shadow-sm mb-4 group-hover:scale-105 transition-transform">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                      ) : (
                        <Building className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {company.name}
                    </CardTitle>
                    <div className="text-sm text-primary font-medium mt-1">
                      {company.industry || 'Technology'}
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-3 text-center mb-6">
                      {company.description || 'No description available for this company.'}
                    </p>
                    <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                      {company.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[100px]">{company.location}</span>
                        </div>
                      )}
                      {company.size && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span>{company.size}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
