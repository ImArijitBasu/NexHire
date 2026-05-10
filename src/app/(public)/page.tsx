'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { jobsAPI, companiesAPI, generalAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import {
  Search, Briefcase, Building2, TrendingUp, Users, MapPin, DollarSign, Clock,
  BrainCircuit, FileText, Sparkles, MessageSquare, ArrowRight, Star, CheckCircle2,
  Zap, Target, Shield, Mail,
} from 'lucide-react';

/* ───────────────────────── HERO ───────────────────────── */
function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-linear-to-b from-background via-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> AI-Powered Job Matching Platform
          </Badge>
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Find your dream job with{' '}
              <span className="text-primary bg-clip-text">AI matching</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              NexHire uses advanced artificial intelligence to match your unique skills and experience with the perfect opportunities.
            </p>
          </div>
          <div className="w-full max-w-2xl">
            <form className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9 h-12 bg-background" placeholder="Job title, keywords, or company" />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9 h-12 bg-background" placeholder="City, state, or remote" />
              </div>
              <Link href="/jobs"><Button className="h-12 px-8">Search Jobs</Button></Link>
            </form>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-3">
              <span>Popular:</span>
              <Link href="/jobs?search=Software+Engineer" className="hover:text-primary transition-colors">Software Engineer</Link>
              <span>•</span>
              <Link href="/jobs?search=Product+Manager" className="hover:text-primary transition-colors">Product Manager</Link>
              <span>•</span>
              <Link href="/jobs?search=Remote" className="hover:text-primary transition-colors">Remote</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── STATS ───────────────────────── */
function StatsSection() {
  const stats = [
    { icon: Briefcase, value: '10,000+', label: 'Active Jobs' },
    { icon: Building2, value: '2,500+', label: 'Companies' },
    { icon: Users, value: '50,000+', label: 'Job Seekers' },
    { icon: TrendingUp, value: '95%', label: 'Match Rate' },
  ];
  return (
    <section className="w-full py-12 md:py-16 bg-background border-y">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center space-y-2">
              <s.icon className="h-8 w-8 text-primary mb-2" />
              <h3 className="text-3xl font-bold">{s.value}</h3>
              <p className="text-muted-foreground font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── FEATURED JOBS ─────────────────── */
function FeaturedJobsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-jobs-home'],
    queryFn: async () => { const res = await jobsAPI.getFeatured(); return res.data; },
  });
  const jobs = (data?.data || []).slice(0, 4);

  return (
    <section className="w-full py-16 md:py-24 bg-muted/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Featured Opportunities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Top curated positions from leading companies, handpicked for you.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}><CardHeader><Skeleton className="h-6 w-2/3 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-16 w-full" /></CardContent></Card>
              ))
            : jobs.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center mb-2"><Briefcase className="h-5 w-5 text-primary" /></div>
                    <CardTitle className="text-lg">{['Senior React Dev', 'Product Designer', 'Data Scientist', 'DevOps Engineer'][i]}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" />{['TechCorp', 'DesignHub', 'DataFlow', 'CloudBase'][i]}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Badge variant="secondary" className="text-xs">Full Time</Badge>
                      <Badge variant="outline" className="text-xs">Remote</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" />$80k - $150k</p>
                  </CardContent>
                  <CardFooter><Link href="/jobs" className="w-full"><Button variant="outline" className="w-full" size="sm">View Details</Button></Link></CardFooter>
                </Card>
              ))
            : jobs.map((job: any) => (
                <Card key={job.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center mb-2 overflow-hidden">
                      {job.company?.logo ? <img src={job.company.logo} alt="" className="h-full w-full object-cover" /> : <Briefcase className="h-5 w-5 text-primary" />}
                    </div>
                    <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" />{job.company?.name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Badge variant="secondary" className="text-xs">{job.type?.replace('_', ' ')}</Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{job.location}</Badge>
                    </div>
                    {job.salaryMin && <p className="text-sm text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" />${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}</p>}
                  </CardContent>
                  <CardFooter><Link href={`/jobs/${job.slug}`} className="w-full"><Button variant="outline" className="w-full" size="sm">View Details</Button></Link></CardFooter>
                </Card>
              ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/jobs"><Button size="lg">Browse All Jobs <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── HOW IT WORKS ─────────────────── */
function HowItWorksSection() {
  const steps = [
    { icon: FileText, title: 'Create Your Profile', desc: 'Sign up and build your professional profile with skills, experience, and resume.' },
    { icon: BrainCircuit, title: 'AI Matches Jobs', desc: 'Our AI engine analyzes your profile and matches you with the best opportunities.' },
    { icon: CheckCircle2, title: 'Apply & Get Hired', desc: 'Apply with one click, track your applications, and land your dream job.' },
  ];
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">How NexHire Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to your next career move.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center space-y-4 p-6">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center relative">
                <step.icon className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 h-7 w-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── AI FEATURES ──────────────────── */
function AIFeaturesSection() {
  const features = [
    { icon: BrainCircuit, title: 'Resume Analyzer', desc: 'Get AI-powered feedback, ATS scoring, and improvement suggestions for your resume.' },
    { icon: Sparkles, title: 'Cover Letter Generator', desc: 'Generate tailored cover letters for any job posting in seconds.' },
    { icon: Target, title: 'Smart Job Matching', desc: 'AI matches your skills and experience to the best-fit job opportunities.' },
    { icon: MessageSquare, title: 'Interview Coach', desc: 'Practice with our AI chatbot for mock interviews and behavioral questions.' },
  ];
  return (
    <section className="w-full py-16 md:py-24 bg-muted/30 border-y">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4"><Zap className="h-3 w-3 mr-1" /> Powered by Gemini AI</Badge>
          <h2 className="text-3xl font-bold tracking-tight mb-3">AI Career Tools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Leverage cutting-edge AI to supercharge your job search.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <Card key={i} className="bg-background/80 backdrop-blur hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/auth/register"><Button variant="outline" size="lg">Try AI Tools Free <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── TOP COMPANIES ──────────────────── */
function TopCompaniesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['top-companies-home'],
    queryFn: async () => { try { const res = await companiesAPI.getAll(); return res.data; } catch { return { data: [] }; } },
  });
  const companies = (data?.data || []).slice(0, 6);

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Top Companies Hiring</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Join thousands of professionals at leading organizations.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            : companies.length === 0
            ? ['TechCorp', 'DesignHub', 'DataFlow', 'CloudBase', 'FinanceAI', 'GreenTech'].map((name, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><Building2 className="h-6 w-6 text-primary" /></div>
                  <p className="font-medium text-sm">{name}</p>
                </div>
              ))
            : companies.map((c: any) => (
                <Link key={c.id} href={`/companies/${c.slug}`} className="flex flex-col items-center justify-center p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 overflow-hidden">
                    {c.logo ? <img src={c.logo} alt={c.name} className="h-full w-full object-cover" /> : <Building2 className="h-6 w-6 text-primary" />}
                  </div>
                  <p className="font-medium text-sm text-center">{c.name}</p>
                </Link>
              ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/companies"><Button variant="outline">View All Companies <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── TESTIMONIALS ──────────────────── */
function TestimonialsSection() {
  const testimonials = [
    { name: 'Sarah Chen', role: 'Frontend Developer', company: 'TechCorp', text: 'NexHire\'s AI matched me with my dream job in just 2 weeks. The resume analyzer was incredibly helpful!', rating: 5 },
    { name: 'Michael Brooks', role: 'Product Manager', company: 'DesignHub', text: 'The AI cover letter generator saved me hours. I got 3x more interview callbacks after using NexHire.', rating: 5 },
    { name: 'Emily Rodriguez', role: 'Data Scientist', company: 'DataFlow', text: 'The interview coach feature helped me prepare for tough technical questions. Landed a 40% salary increase!', rating: 5 },
  ];
  return (
    <section className="w-full py-16 md:py-24 bg-muted/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Real stories from professionals who found success with NexHire.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-background">
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-muted-foreground italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{t.name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} at {t.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── CTA FOR EMPLOYERS ──────────────────── */
function EmployerCTASection() {
  return (
    <section className="w-full py-20 md:py-32 bg-background border-y">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-2">For Employers</Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Hire the best talent faster with AI</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg">
              Post jobs, review AI-scored applications, and connect with top candidates. Our matching algorithm ensures you only see the most qualified applicants.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              {['AI-powered candidate matching', 'Automated resume screening', 'Smart interview scheduling', 'Real-time analytics dashboard'].map((item) => (
                <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />{item}</li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/auth/register?role=employer"><Button size="lg">Post a Job</Button></Link>
              <Link href="/about"><Button variant="outline" size="lg">Learn More</Button></Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[500px] aspect-video rounded-xl bg-muted border overflow-hidden shadow-xl flex items-center justify-center bg-linear-to-br from-primary/5 to-primary/20">
            <div className="text-center space-y-3 p-8">
              <Shield className="h-16 w-16 text-primary mx-auto opacity-50" />
              <p className="text-muted-foreground font-medium">Employer Dashboard</p>
              <p className="text-xs text-muted-foreground">AI-powered hiring tools</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── NEWSLETTER ──────────────────── */
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await generalAPI.subscribeNewsletter(email);
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch { toast.error('Failed to subscribe. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <section className="w-full py-16 md:py-24 bg-primary/5">
      <div className="container px-4 md:px-6 text-center">
        <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold tracking-tight mb-3">Stay Updated</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">Get the latest job opportunities and career tips delivered to your inbox weekly.</p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 bg-background" required />
          <Button type="submit" className="h-12 px-8" disabled={loading}>{loading ? 'Subscribing...' : 'Subscribe'}</Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */
function FAQSection() {
  const faqs = [
    { q: 'How does AI job matching work?', a: 'Our AI analyzes your skills, experience, and preferences to match you with the most relevant job openings. It uses natural language processing to understand job descriptions and your profile.' },
    { q: 'Is NexHire free for job seekers?', a: 'Yes! Creating a profile, searching jobs, applying, and using AI tools are all completely free for job seekers.' },
    { q: 'What AI features are available?', a: 'NexHire offers 4 AI tools: Resume Analyzer (ATS scoring), Cover Letter Generator, Smart Job Matching, and an AI Interview Coach chatbot.' },
    { q: 'How do employers post jobs?', a: 'Employers can register, create a company profile, and start posting jobs immediately. Our AI helps screen and rank applicants automatically.' },
    { q: 'Is my data secure?', a: 'Absolutely. We use industry-standard encryption, JWT authentication, and rate limiting. Your data is never shared with third parties without consent.' },
  ];
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about NexHire.</p>
        </div>
        <Accordion className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ───────────────────── MAIN PAGE ───────────────────── */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturedJobsSection />
      <HowItWorksSection />
      <AIFeaturesSection />
      <TopCompaniesSection />
      <TestimonialsSection />
      <EmployerCTASection />
      <NewsletterSection />
      <FAQSection />
    </div>
  );
}
