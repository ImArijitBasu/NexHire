import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">NexHire</span>
          </Link>
          {children}
        </div>
      </div>
      <div className="hidden lg:flex flex-col justify-center items-center bg-muted/50 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative z-10 max-w-lg text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Join the Future of Hiring</h2>
          <p className="text-muted-foreground text-lg">
            Whether you're looking for your dream job or the perfect candidate, 
            NexHire's AI-powered platform makes it happen.
          </p>
        </div>
      </div>
    </div>
  );
}
