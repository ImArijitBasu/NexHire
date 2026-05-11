'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { aiAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, FileText, Sparkles, MessageSquare, Loader2, Upload, Target, Send, Bot, User, Copy, CheckCircle2, AlertCircle, History, Calendar, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AIToolsPage() {
  // Resume Analyzer state
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');

  // Cover Letter state
  const [clJobTitle, setClJobTitle] = useState('');
  const [clCompany, setClCompany] = useState('');
  const [clJobDescription, setClJobDescription] = useState('');
  const [clSkills, setClSkills] = useState('');
  const [clExperience, setClExperience] = useState('');

  // Job Match state
  const [matchSkills, setMatchSkills] = useState('');
  const [matchDescription, setMatchDescription] = useState('');

  // Interview Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [chatJobTitle, setChatJobTitle] = useState('');
  const [chatCompany, setChatCompany] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Resume Analyzer Mutation
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const res = await aiAPI.analyzeResume({ resumeText, targetRole: targetRole || undefined });
      return res.data;
    },
    onSuccess: () => toast.success('Analysis complete!'),
    onError: (err: any) => toast.error(err.response?.data?.error || 'Analysis failed'),
  });

  // Cover Letter Mutation
  const coverLetterMutation = useMutation({
    mutationFn: async () => {
      const res = await aiAPI.generateCoverLetter({
        jobTitle: clJobTitle,
        company: clCompany,
        jobDescription: clJobDescription || undefined,
        userSkills: clSkills ? clSkills.split(',').map(s => s.trim()) : undefined,
        experience: clExperience || undefined,
      });
      return res.data;
    },
    onSuccess: () => toast.success('Cover letter generated!'),
    onError: (err: any) => toast.error(err.response?.data?.error || 'Generation failed'),
  });

  // Job Match Mutation
  const matchMutation = useMutation({
    mutationFn: async () => {
      const res = await aiAPI.matchJobs({
        preferences: {
          skills: matchSkills || undefined,
          description: matchDescription || undefined,
        },
      });
      return res.data;
    },
    onSuccess: () => toast.success('Job matching complete!'),
    onError: (err: any) => toast.error(err.response?.data?.error || 'Matching failed'),
  });

  // Interview Chat Mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await aiAPI.interviewChat({
        message,
        sessionId: chatSessionId || undefined,
        jobTitle: chatJobTitle || undefined,
        company: chatCompany || undefined,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setChatSessionId(data.sessionId);
      setChatHistory(prev => [
        ...prev,
        { role: 'model', content: data.response },
      ]);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Chat failed'),
  });

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }]);
    chatMutation.mutate(chatMessage);
    setChatMessage('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          AI Career Tools
        </h1>
        <p className="text-muted-foreground">Leverage our advanced Gemini AI to improve your job search success rate.</p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 p-3.5 rounded-lg flex items-start gap-3 mt-4">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">Warning: Unsaved Progress</p>
          <p className="opacity-90 mt-0.5 text-xs">Your progress and generated results will be lost if you reload this page. Please save or copy any important information before leaving.</p>
        </div>
      </div>

      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full md:w-[700px] grid-cols-4">
          <TabsTrigger value="resume" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Resume</span>
          </TabsTrigger>
          <TabsTrigger value="cover-letter" className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Cover Letter</span>
          </TabsTrigger>
          <TabsTrigger value="job-match" className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Job Match</span>
          </TabsTrigger>
          <TabsTrigger value="interview" className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Interview</span>
          </TabsTrigger>
        </TabsList>

        {/* ====== RESUME ANALYZER TAB ====== */}
        <TabsContent value="resume" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div>
                  <CardTitle>Resume Analyzer</CardTitle>
                  <CardDescription>Paste your resume to get AI-powered feedback, ATS score, and improvement suggestions.</CardDescription>
                </div>
                <ToolHistoryModal type="resume_analysis" title="Resume Analysis" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resume">Your Resume (Text) *</Label>
                  <Textarea id="resume" placeholder="Paste your resume content here..." className="min-h-[180px] resize-y" value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Role (Optional)</Label>
                  <Input id="targetRole" placeholder="e.g. Senior Frontend Developer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => analyzeMutation.mutate()} disabled={!resumeText.trim() || analyzeMutation.isPending}>
                  {analyzeMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Analyze Resume</>}
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader><CardTitle>AI Analysis Results</CardTitle></CardHeader>
              <CardContent className="flex-1">
                {analyzeMutation.data?.analysis ? (
                  <ScrollArea className="h-[420px] w-full rounded-md border p-4 bg-muted/20">
                    <AnalysisResult data={analyzeMutation.data.analysis} />
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
        </TabsContent>

        {/* ====== COVER LETTER TAB ====== */}
        <TabsContent value="cover-letter" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div>
                  <CardTitle>Cover Letter Generator</CardTitle>
                  <CardDescription>Provide job details and the AI will craft a personalized cover letter.</CardDescription>
                </div>
                <ToolHistoryModal type="cover_letter" title="Cover Letter" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Job Title *</Label>
                    <Input placeholder="e.g. Frontend Developer" value={clJobTitle} onChange={(e) => setClJobTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Company *</Label>
                    <Input placeholder="e.g. Google" value={clCompany} onChange={(e) => setClCompany(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Job Description (Optional)</Label>
                  <Textarea placeholder="Paste the job description..." className="min-h-[100px]" value={clJobDescription} onChange={(e) => setClJobDescription(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Your Skills (comma-separated)</Label>
                    <Input placeholder="React, TypeScript, Node.js" value={clSkills} onChange={(e) => setClSkills(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Experience</Label>
                    <Input placeholder="e.g. 3 years in frontend" value={clExperience} onChange={(e) => setClExperience(e.target.value)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => coverLetterMutation.mutate()} disabled={!clJobTitle.trim() || !clCompany.trim() || coverLetterMutation.isPending}>
                  {coverLetterMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Cover Letter</>}
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader><CardTitle>Generated Cover Letter</CardTitle></CardHeader>
              <CardContent className="flex-1">
                {coverLetterMutation.data?.coverLetter ? (
                  <div className="relative h-full">
                    <Textarea className="min-h-[400px] h-full font-mono text-sm resize-none" value={typeof coverLetterMutation.data.coverLetter === 'string' ? coverLetterMutation.data.coverLetter : coverLetterMutation.data.coverLetter.coverLetter || JSON.stringify(coverLetterMutation.data.coverLetter, null, 2)} readOnly />
                    <Button size="sm" className="absolute top-2 right-2" onClick={() => handleCopy(typeof coverLetterMutation.data.coverLetter === 'string' ? coverLetterMutation.data.coverLetter : coverLetterMutation.data.coverLetter.coverLetter)}>
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>
                  </div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10 p-8 text-center">
                    <FileText className="h-12 w-12 mb-4 opacity-20" />
                    <p>Generate a tailored cover letter based on your job details.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ====== JOB MATCH TAB ====== */}
        <TabsContent value="job-match" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div>
                  <CardTitle>Smart Job Matching</CardTitle>
                  <CardDescription>Let AI analyze active jobs and find the best matches for your skills and preferences.</CardDescription>
                </div>
                <ToolHistoryModal type="job_match" title="Job Match" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Skills (Optional - uses profile skills if empty)</Label>
                  <Input placeholder="e.g. React, TypeScript, Node.js, Python" value={matchSkills} onChange={(e) => setMatchSkills(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>What are you looking for?</Label>
                  <Textarea placeholder="Describe your ideal role, preferred industry, work style, salary range..." className="min-h-[120px]" value={matchDescription} onChange={(e) => setMatchDescription(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => matchMutation.mutate()} disabled={matchMutation.isPending}>
                  {matchMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding Matches...</> : <><Target className="mr-2 h-4 w-4" /> Find My Best Matches</>}
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader><CardTitle>Match Results</CardTitle></CardHeader>
              <CardContent className="flex-1">
                {matchMutation.data?.result ? (
                  <ScrollArea className="h-[420px] w-full rounded-md border p-4 bg-muted/20">
                    <MatchResults data={matchMutation.data.result} />
                  </ScrollArea>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10 p-8 text-center">
                    <Target className="h-12 w-12 mb-4 opacity-20" />
                    <p>Run the AI matcher to discover jobs that best fit your profile.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ====== INTERVIEW COACH TAB ====== */}
        <TabsContent value="interview" className="mt-4">
          <Card className="flex flex-col overflow-hidden border-2 shadow-sm" style={{ height: '700px' }}>
            <CardHeader className="border-b bg-muted/30 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> AI Interview Coach</CardTitle>
                  <CardDescription className="mt-1">Practice answering interview questions with our interactive AI coach.</CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <ChatHistoryModal />
                  {chatSessionId && (
                    <Button variant="outline" size="sm" onClick={() => { setChatHistory([]); setChatSessionId(null); }}>
                      End Session
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Input placeholder="Target Job Title (optional)" value={chatJobTitle} onChange={(e) => setChatJobTitle(e.target.value)} className="bg-background shadow-sm" />
                <Input placeholder="Target Company (optional)" value={chatCompany} onChange={(e) => setChatCompany(e.target.value)} className="bg-background shadow-sm" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-linear-to-b from-muted/5 to-muted/20 relative">
              <ScrollArea className="flex-1 px-4 py-6" style={{ height: 'calc(100% - 80px)' }}>
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-20">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 shadow-sm">
                      <Bot className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-semibold text-lg text-foreground">Hi! I&apos;m your AI Interview Coach.</p>
                    <p className="text-sm mt-2 max-w-sm leading-relaxed">Let&apos;s practice answering behavioral questions, run a mock interview, or go over salary negotiation strategies.</p>
                    <Button variant="outline" className="mt-6 shadow-sm rounded-full px-6" onClick={() => {
                      setChatMessage("I'd like to do a mock interview.");
                      setTimeout(() => handleSendChat(), 50);
                    }}>Start a Mock Interview</Button>
                  </div>
                ) : (
                  <div className="space-y-6 pb-4">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                          <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-auto border border-primary/20">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-[15px] whitespace-pre-wrap leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-background border rounded-bl-sm text-foreground'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatMutation.isPending && (
                      <div className="flex gap-3 justify-start">
                        <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-auto border border-primary/20">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-background border rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                          <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"></span>
                          <span className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                          <span className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 bg-background border-t shadow-[0_-4px_10px_-10px_rgba(0,0,0,0.1)]">
                <div className="relative flex items-center max-w-4xl mx-auto">
                  <Input
                    placeholder="Type your message here..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendChat(); } }}
                    disabled={chatMutation.isPending}
                    className="pr-14 rounded-full bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary shadow-inner border-muted-foreground/20 h-12 text-[15px]"
                  />
                  <Button 
                    onClick={handleSendChat} 
                    disabled={!chatMessage.trim() || chatMutation.isPending} 
                    size="icon"
                    className="absolute right-1.5 h-9 w-9 rounded-full shadow-sm transition-transform active:scale-95"
                  >
                    <Send className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
                <p className="text-center text-[10px] text-muted-foreground mt-2 font-medium tracking-wide opacity-70">AI INTERVIEW COACH • NEXHIRE AI SYSTEM</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sub-component: Resume Analysis Result
function AnalysisResult({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Overall Score</h3>
        <Badge className={`text-lg px-3 py-1 ${data.overallScore >= 70 ? 'bg-green-100 text-green-700' : data.overallScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
          {data.overallScore}/100
        </Badge>
      </div>
      {data.atsScore && <div className="flex justify-between text-muted-foreground"><span>ATS Compatibility</span><span className="font-medium">{data.atsScore}/100</span></div>}
      {data.summary && <p className="text-muted-foreground border-l-2 border-primary pl-3">{data.summary}</p>}
      {data.strengths?.length > 0 && (
        <div><h4 className="font-semibold text-green-700 mb-1">✅ Strengths</h4><ul className="list-disc pl-5 space-y-1 text-muted-foreground">{data.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
      )}
      {data.weaknesses?.length > 0 && (
        <div><h4 className="font-semibold text-red-600 mb-1">⚠️ Weaknesses</h4><ul className="list-disc pl-5 space-y-1 text-muted-foreground">{data.weaknesses.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
      )}
      {data.suggestions?.length > 0 && (
        <div><h4 className="font-semibold mb-1">💡 Suggestions</h4><ul className="list-disc pl-5 space-y-1 text-muted-foreground">{data.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
      )}
      {data.missingKeywords?.length > 0 && (
        <div><h4 className="font-semibold mb-1">🔑 Missing Keywords</h4><div className="flex flex-wrap gap-1">{data.missingKeywords.map((k: string, i: number) => <Badge key={i} variant="outline" className="text-xs">{k}</Badge>)}</div></div>
      )}
      {data.industryFit && <p className="text-muted-foreground"><strong>Industry Fit:</strong> {data.industryFit}</p>}
    </div>
  );
}

// Sub-component: Job Match Results
function MatchResults({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="space-y-4 text-sm">
      {data.careerAdvice && <p className="text-muted-foreground border-l-2 border-primary pl-3 italic">{data.careerAdvice}</p>}
      {data.trendingSkills?.length > 0 && (
        <div><h4 className="font-semibold mb-1">🔥 Trending Skills</h4><div className="flex flex-wrap gap-1">{data.trendingSkills.map((s: string, i: number) => <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>)}</div></div>
      )}
      {data.matches?.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Top Matches</h4>
          {data.matches.map((m: any, i: number) => (
            <div key={i} className="p-3 border rounded-lg bg-background space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{m.job?.title || 'Job'}</p>
                  <p className="text-xs text-muted-foreground">{m.job?.company?.name}</p>
                </div>
                <Badge className={`${m.matchScore >= 80 ? 'bg-green-100 text-green-700' : m.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-muted'}`}>
                  {m.matchScore}%
                </Badge>
              </div>
              {m.recommendation && <p className="text-xs text-muted-foreground">{m.recommendation}</p>}
              {m.missingSkills?.length > 0 && (
                <div className="flex flex-wrap gap-1">{m.missingSkills.map((s: string, j: number) => <Badge key={j} variant="outline" className="text-xs">+{s}</Badge>)}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-component: Tool History Modal
function ToolHistoryModal({ type, title }: { type: string, title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['ai-history', type],
    queryFn: async () => {
      const res = await aiAPI.getHistory({ type });
      return res.data;
    },
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setSelectedItem(null); }}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="shrink-0" />}>
        <History className="h-4 w-4 mr-2" /> History
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{title} History</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : selectedItem ? (
            <div className="flex flex-col h-full bg-muted/10">
              <div className="px-6 py-3 border-b bg-background flex items-center">
                <Button variant="ghost" size="sm" className="-ml-2" onClick={() => setSelectedItem(null)}>
                  &larr; Back to List
                </Button>
                <div className="ml-auto text-xs text-muted-foreground">{new Date(selectedItem.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
                {type === 'resume_analysis' && <AnalysisResult data={selectedItem.result} />}
                {type === 'job_match' && <MatchResults data={selectedItem.result} />}
                {type === 'cover_letter' && (
                  <Textarea className="min-h-[400px] w-full font-mono text-sm resize-none" value={typeof selectedItem.result === 'string' ? selectedItem.result : selectedItem.result.coverLetter || JSON.stringify(selectedItem.result, null, 2)} readOnly />
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
              {data?.results?.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground flex flex-col items-center">
                  <History className="h-10 w-10 opacity-20 mb-3" />
                  No history found. Generated results will appear here.
                </div>
              ) : (
                <div className="divide-y px-2">
                  {data?.results?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setSelectedItem(item)}>
                      <div>
                        <p className="font-medium text-[15px]">{item.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Calendar className="h-3 w-3" /> {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Sub-component: Chat History Modal
function ChatHistoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['ai-chat-sessions'],
    queryFn: async () => {
      const res = await aiAPI.getChatSessions();
      return res.data;
    },
    enabled: isOpen && !selectedSession,
  });

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['ai-chat-messages', selectedSession],
    queryFn: async () => {
      if (!selectedSession) return null;
      const res = await aiAPI.getChatMessages(selectedSession);
      return res.data;
    },
    enabled: !!selectedSession,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setSelectedSession(null); }}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="shrink-0" />}>
        <History className="h-4 w-4 mr-2" /> Chat History
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Interview Sessions</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {selectedSession ? (
            <div className="flex flex-col h-full bg-muted/10">
              <div className="px-6 py-3 border-b bg-background">
                <Button variant="ghost" size="sm" className="-ml-2" onClick={() => setSelectedSession(null)}>
                  &larr; Back to Sessions
                </Button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
                {messagesLoading ? (
                  <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                  <div className="space-y-6 pb-4">
                    {messagesData?.messages?.map((msg: any, i: number) => (
                      <div key={i} className={`flex gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                          <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-auto border border-primary/20">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-[15px] whitespace-pre-wrap leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-background border rounded-bl-sm text-foreground'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
              {sessionsLoading ? (
                <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : sessionsData?.sessions?.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground flex flex-col items-center">
                  <History className="h-10 w-10 opacity-20 mb-3" />
                  No interview sessions found.
                </div>
              ) : (
                <div className="divide-y px-2">
                  {sessionsData?.sessions?.map((session: any) => (
                    <div key={session.sessionId} className="flex items-center justify-between p-4 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setSelectedSession(session.sessionId)}>
                      <div>
                        <p className="font-medium text-[15px]">Interview Session</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Calendar className="h-3 w-3" /> {new Date(session.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
