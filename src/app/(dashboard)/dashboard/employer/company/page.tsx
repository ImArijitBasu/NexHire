'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Building, Upload } from 'lucide-react';

const companySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  description: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  founded: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompanyProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data, isLoading } = useQuery({
    queryKey: ['my-company'],
    queryFn: async () => {
      try {
        const res = await companiesAPI.getMy();
        return res.data;
      } catch (err) {
        return null;
      }
    },
  });

  const company = data?.data;

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      description: '',
      industry: '',
      size: '',
      founded: '',
      website: '',
      location: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name || '',
        description: company.description || '',
        industry: company.industry || '',
        size: company.size || '',
        founded: company.founded || '',
        website: company.website || '',
        location: company.location || '',
        email: company.email || '',
        phone: company.phone || '',
      });
    }
  }, [company, form]);

  const mutation = useMutation({
    mutationFn: async (values: CompanyFormValues) => {
      if (company?.id) {
        return companiesAPI.update(company.id, values);
      } else {
        return companiesAPI.create({ ...values, slug: values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      toast.success('Company profile updated successfully');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update company profile');
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  const isFormActive = isEditing || !company;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground">Manage your company's public information.</p>
        </div>
        {company && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>Your company logo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="h-32 w-32 rounded-xl border bg-muted flex items-center justify-center overflow-hidden">
                {company?.logo ? (
                  <img src={company.logo} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <Building className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <Button variant="outline" className="w-full" disabled={!isFormActive}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>Banner for your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 w-full rounded-md border bg-muted mb-4 overflow-hidden">
                {company?.coverImage ? (
                  <img src={company.coverImage} alt="Cover" className="h-full w-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5" />
                )}
              </div>
              <Button variant="outline" className="w-full" disabled={!isFormActive}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Cover
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input id="name" {...form.register('name')} disabled={!isFormActive} />
                    {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">About Us</Label>
                    <Textarea 
                      id="description" 
                      {...form.register('description')} 
                      disabled={!isFormActive}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input id="industry" {...form.register('industry')} disabled={!isFormActive} placeholder="e.g. Technology" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Company Size</Label>
                      <Input id="size" {...form.register('size')} disabled={!isFormActive} placeholder="e.g. 50-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Headquarters Location</Label>
                      <Input id="location" {...form.register('location')} disabled={!isFormActive} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founded">Founded Year</Label>
                      <Input id="founded" {...form.register('founded')} disabled={!isFormActive} placeholder="e.g. 2015" />
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website URL</Label>
                      <Input id="website" {...form.register('website')} disabled={!isFormActive} placeholder="https://..." />
                      {form.formState.errors.website && <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Contact Email</Label>
                      <Input id="email" type="email" {...form.register('email')} disabled={!isFormActive} />
                      {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input id="phone" {...form.register('phone')} disabled={!isFormActive} />
                    </div>
                  </div>
                </div>

                {isFormActive && (
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    {company && (
                      <Button variant="outline" type="button" onClick={() => {
                        form.reset();
                        setIsEditing(false);
                      }}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Profile
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
