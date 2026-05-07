import Link from 'next/link';
import { Briefcase, X, } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background flex mx-auto max-w-11/12">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">NexHire</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered job board connecting top talent with innovative companies.
              The future of hiring starts here.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                {/* <Linked className="h-5 w-5" /> */}
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                {/* <Github className="h-5 w-5" /> */}
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Seekers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/jobs" className="hover:text-foreground transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="hover:text-foreground transition-colors">Browse Companies</Link></li>
              <li><Link href="/dashboard/seeker/ai-tools" className="hover:text-foreground transition-colors">AI Resume Builder</Link></li>
              <li><Link href="/auth/register" className="hover:text-foreground transition-colors">Create Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/auth/register?role=employer" className="hover:text-foreground transition-colors">Post a Job</Link></li>
              <li><Link href="/dashboard/employer" className="hover:text-foreground transition-colors">Employer Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/resources" className="hover:text-foreground transition-colors">Hiring Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NexHire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
