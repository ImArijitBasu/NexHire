'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'EMPLOYER' : 'SEEKER';
  
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, role };
      const res = await authAPI.register(payload);
      
      if (res.data.success) {
        setAuth(res.data.user, res.data.token);
        toast.success('Account created successfully');
        
        // Redirect based on role
        if (res.data.user.role === 'EMPLOYER') router.push('/dashboard/employer');
        else router.push('/dashboard/seeker');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">Get started with NexHire today</p>
      </div>

      <Tabs defaultValue={initialRole.toLowerCase()} onValueChange={(v) => setRole(v.toUpperCase())} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="seeker">Job Seeker</TabsTrigger>
          <TabsTrigger value="employer">Employer</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder={role === 'EMPLOYER' ? "Company contact name" : "John Doe"} 
              required 
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Create a strong password"
              required 
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : `Sign up as ${role === 'EMPLOYER' ? 'Employer' : 'Seeker'}`}
          </Button>
        </form>
      </Tabs>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
