'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Target, Users, Shield, Zap, Heart, Globe, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const values = [
    { icon: Target, title: 'Mission-Driven', desc: 'We believe everyone deserves a fulfilling career. Our AI makes job matching accessible to all.' },
    { icon: BrainCircuit, title: 'AI-First', desc: 'Cutting-edge Gemini AI powers every feature — from resume analysis to interview coaching.' },
    { icon: Shield, title: 'Trust & Privacy', desc: 'Your data is encrypted and never shared. We follow industry-leading security practices.' },
    { icon: Heart, title: 'People-Centered', desc: 'Technology serves people, not the other way around. Every feature is designed for real humans.' },
  ];

  const team = [
    { name: 'NexHire Engineering', role: 'Full-Stack Development', initial: 'NE' },
    { name: 'AI Research Team', role: 'Machine Learning & NLP', initial: 'AI' },
    { name: 'Product Design', role: 'UX/UI Design', initial: 'PD' },
    { name: 'Career Experts', role: 'Industry Advisory', initial: 'CE' },
  ];

  return (
    <div className="container max-w-5xl px-4 py-12 md:py-20">
      {/* Hero */}
      <div className="text-center mb-16 space-y-4">
        <Badge variant="secondary" className="mb-2"><Globe className="h-3 w-3 mr-1" /> About NexHire</Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Connecting Talent with Opportunity Through AI</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          NexHire is an AI-powered job board platform that uses advanced machine learning to match job seekers with their ideal roles and help employers find the best candidates faster.
        </p>
      </div>

      {/* Mission */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            The traditional hiring process is broken — resumes get lost, qualified candidates are overlooked, and employers spend weeks sorting through unqualified applications.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            NexHire was built to solve this. By leveraging Google&apos;s Gemini AI, we analyze resumes, match skills to job requirements, generate personalized cover letters, and even help candidates prepare for interviews — all in one platform.
          </p>
          <div className="flex gap-3 pt-2">
            <Link href="/auth/register"><Button>Get Started Free</Button></Link>
            <Link href="/jobs"><Button variant="outline">Browse Jobs</Button></Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[{ label: 'Active Jobs', value: '10,000+' }, { label: 'Companies', value: '2,500+' }, { label: 'AI Analyses', value: '100K+' }, { label: 'Success Rate', value: '95%' }].map((s) => (
            <div key={s.label} className="p-6 rounded-xl border bg-card text-center">
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-10">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <Card key={i} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Built with Modern Technology</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">NexHire is built with a cutting-edge, production-ready stack.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Express.js', 'Gemini AI', 'Zustand', 'TanStack Query', 'Zod', 'Recharts', 'JWT Auth'].map((tech) => (
            <Badge key={tech} variant="outline" className="px-4 py-2 text-sm">{tech}</Badge>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Our Teams</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((t, i) => (
            <div key={i} className="text-center p-6 rounded-xl border bg-card">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg mb-3">{t.initial}</div>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center p-12 rounded-2xl bg-muted/50 border">
        <Award className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ready to Transform Your Job Search?</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">Join thousands of professionals already using NexHire to advance their careers.</p>
        <Link href="/auth/register"><Button size="lg">Create Free Account</Button></Link>
      </div>
    </div>
  );
}
