'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generalAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Clock, Loader2, CheckCircle2 } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    try {
      await generalAPI.submitContact(data);
      toast.success('Message sent successfully!');
      setSubmitted(true);
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@nexhire.com', href: 'mailto:support@nexhire.com' },
    { icon: MapPin, label: 'Location', value: 'San Francisco, CA, USA' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: Clock, label: 'Hours', value: 'Mon-Fri, 9am-6pm PST' },
  ];

  return (
    <div className="container max-w-5xl px-4 py-12 md:py-20">
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Get In Touch</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Have a question, feedback, or partnership inquiry? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          {contactInfo.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{item.value}</a>
                ) : (
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we&apos;ll get back to you within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold">Message Sent!</h3>
                <p className="text-muted-foreground">Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
                <Button variant="outline" onClick={() => { setSubmitted(false); form.reset(); }}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" {...form.register('name')} placeholder="John Doe" />
                    {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...form.register('email')} placeholder="john@example.com" />
                    {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" {...form.register('subject')} placeholder="How can we help?" />
                  {form.formState.errors.subject && <p className="text-xs text-destructive">{form.formState.errors.subject.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" {...form.register('message')} placeholder="Tell us more about your inquiry..." className="min-h-[120px]" />
                  {form.formState.errors.message && <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
