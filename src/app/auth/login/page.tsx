'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(formData);
      if (res.data.success) {
        setAuth(res.data.user, res.data.token);
        toast.success('Logged in successfully');
        if (res.data.user.role === 'ADMIN') router.push('/dashboard/admin');
        else if (res.data.user.role === 'EMPLOYER') router.push('/dashboard/employer');
        else router.push('/dashboard/seeker');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = async (role: 'seeker' | 'admin' | 'employer') => {
    const creds: Record<string, { email: string; password: string }> = {
      seeker: { email: 'seeker@nexhire.com', password: 'password123' },
      admin: { email: 'admin@nexhire.com', password: 'password123' },
      employer: { email: 'employer@nexhire.com', password: 'password123' },
    };
    const demoData = creds[role];
    setFormData(demoData);
    
    setLoading(true);
    try {
      const res = await authAPI.login(demoData);
      if (res.data.success) {
        setAuth(res.data.user, res.data.token);
        toast.success(`Demo ${role} logged in successfully!`);
        if (res.data.user.role === 'ADMIN') router.push('/dashboard/admin');
        else if (res.data.user.role === 'EMPLOYER') router.push('/dashboard/employer');
        else router.push('/dashboard/seeker');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to login as demo ${role}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard/seeker', // Default redirect, can be adjusted based on user role if needed later
      });
    } catch {
      toast.error('Google login is not available right now');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>

      {/* Google OAuth Button */}
      <Button variant="outline" className="w-full h-11 gap-3" onClick={handleGoogleLogin} type="button">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><Separator className="w-full" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} />
        </div>
        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : 'Sign in'}
        </Button>
      </form>

      {/* Demo Login Buttons */}
      <div className="space-y-3 pt-2">
        <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-wider">Quick Demo Access</p>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => fillDemo('seeker')}>
            Demo Seeker
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => fillDemo('employer')}>
            Demo Employer
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => fillDemo('admin')}>
            Demo Admin
          </Button>
        </div>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="font-medium text-primary hover:underline">Sign up</Link>
      </div>
    </div>
  );
}
