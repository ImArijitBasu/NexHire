'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit, FileText, Sparkles, MessageSquare, Loader2, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AIToolsPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  // Resume Analyzer Mutation
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const res = await aiAPI.analyzeResume({ resumeText, jobDescription });
      return res.data;
    },
    onSuccess: () => toast.success('Analysis complete!'),
    onError: (err: any) => toast.error(err.response?.data?.message || 'Analysis failed'),
  });

  // Cover Letter Mutation
  const coverLetterMutation = useMutation({
    mutationFn: async () => {
      const res = await aiAPI.generateCoverLetter({ resumeText, jobDescription });
      return res.data;
    },
    onSuccess: () => toast.success('Cover letter generated!'),
    onError: (err: any) => toast.error(err.response?.data?.message || 'Generation failed'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          AI Career Tools
        </h1>
        <p className="text-muted-foreground">Leverage our advanced AI to improve your job search success rate.</p>
      </div>

      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="resume" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Resume Analyzer</span>
          </TabsTrigger>
          <TabsTrigger value="cover-letter" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Cover Letter</span>
          </TabsTrigger>
          <TabsTrigger value="interview" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Interview Prep</span>
          </TabsTrigger>
        </TabsList>

        {/* RESUME ANALYZER TAB */}
        <TabsContent value="resume" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Input Data</CardTitle>
                  <CardDescription>Paste your resume and the target job description.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="resume">Your Resume (Text)</Label>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        <Upload className="h-3 w-3 mr-1" /> Use Saved Resume
                      </Button>
                    </div>
                    <Textarea 
                      id="resume" 
                      placeholder="Paste your resume content here..." 
                      className="min-h-[150px] resize-y"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobDesc">Target Job Description (Optional)</Label>
                    <Textarea 
                      id="jobDesc" 
                      placeholder="Paste the job description you are aiming for..." 
                      className="min-h-[150px] resize-y"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => analyzeMutation.mutate()}
                    disabled={!resumeText.trim() || analyzeMutation.isPending}
                  >
                    {analyzeMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Sparkles className="mr-2 h-4 w-4" /> Analyze Resume</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>AI Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {analyzeMutation.data ? (
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/20">
                      <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: formatMarkdown(analyzeMutation.data.analysis) }} />
                    </ScrollArea>
                  ) : (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10 p-8 text-center">
                      <BrainCircuit className="h-12 w-12 mb-4 opacity-20" />
                      <p>Run the analysis to see AI feedback, match score, and improvement suggestions.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* COVER LETTER TAB */}
        <TabsContent value="cover-letter" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                  <CardDescription>Provide details for the cover letter.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cl-resume">Your Resume</Label>
                    <Textarea 
                      id="cl-resume" 
                      placeholder="Paste your resume..." 
                      className="min-h-[120px]"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cl-job">Job Description</Label>
                    <Textarea 
                      id="cl-job" 
                      placeholder="Paste the target job description..." 
                      className="min-h-[120px]"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" placeholder="e.g. Acme Corp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone</Label>
                      <Input id="tone" placeholder="e.g. Professional, enthusiastic" defaultValue="Professional" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => coverLetterMutation.mutate()}
                    disabled={!resumeText.trim() || !jobDescription.trim() || coverLetterMutation.isPending}
                  >
                    {coverLetterMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles className="mr-2 h-4 w-4" /> Generate Cover Letter</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Generated Cover Letter</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {coverLetterMutation.data ? (
                    <div className="relative h-full">
                      <Textarea 
                        className="min-h-[400px] h-full font-mono text-sm resize-none" 
                        value={coverLetterMutation.data.coverLetter}
                        readOnly
                      />
                      <Button size="sm" className="absolute top-2 right-2" onClick={() => {
                        navigator.clipboard.writeText(coverLetterMutation.data.coverLetter);
                        toast.success('Copied to clipboard');
                      }}>
                        Copy
                      </Button>
                    </div>
                  ) : (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10 p-8 text-center">
                      <FileText className="h-12 w-12 mb-4 opacity-20" />
                      <p>Generate a tailored cover letter based on your resume and the job description.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* INTERVIEW PREP TAB */}
        <TabsContent value="interview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Interview Simulator</CardTitle>
              <CardDescription>Practice answering interview questions with our interactive AI.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Mock Interviews Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                We are putting the finishing touches on our interactive voice and text interview simulator. 
                Check back soon to practice your skills!
              </p>
              <Button disabled variant="outline" className="mt-4">Notify Me When Available</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Very basic markdown formatter for AI responses
function formatMarkdown(text: string) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/# (.*?)\n/g, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/## (.*?)\n/g, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>')
    .replace(/### (.*?)\n/g, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n- /g, '<br/>• ');
}
