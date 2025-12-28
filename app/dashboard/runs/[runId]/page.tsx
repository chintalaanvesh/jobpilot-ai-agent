'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
  TrendingUpIcon,
  CheckCircle2Icon,
  Loader2Icon,
  ClockIcon,
  XCircleIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileTextIcon,
  MailIcon,
  AwardIcon
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  score: number;
  description: string;
  applyLink: string;
  coverLetter: string;
  mailDraft: string;
  createdAt: string;
}

interface Run {
  id: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  jobs: Job[];
}

function getStatusBadge(status: string) {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any; label: string }> = {
    completed: { variant: 'default', icon: CheckCircle2Icon, label: 'Completed' },
    processing: { variant: 'secondary', icon: Loader2Icon, label: 'Processing' },
    pending: { variant: 'outline', icon: ClockIcon, label: 'Pending' },
    failed: { variant: 'destructive', icon: XCircleIcon, label: 'Failed' },
  };

  const config = variants[status] || variants.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      <Icon className={`h-3 w-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {config.label}
    </Badge>
  );
}

function getScoreColor(score: number) {
  if (score >= 80) return 'bg-green-100 text-green-700 border-green-300';
  if (score >= 60) return 'bg-blue-100 text-blue-700 border-blue-300';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  return 'bg-gray-100 text-gray-700 border-gray-300';
}

export default function RunDetailsPage({
  params
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = use(params);
  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRun();
  }, [runId]);

  async function fetchRun() {
    try {
      const response = await fetch(`/api/runs/${runId}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to fetch run details');
        return;
      }

      setRun(data);
    } catch (error) {
      console.error('Error fetching run:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-32 w-full" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircleIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Run not found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This job search run could not be found.
            </p>
            <Button asChild>
              <Link href="/dashboard">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Job Search Results</h1>
              <p className="text-muted-foreground">View and manage your matched jobs</p>
            </div>
          </div>

          {/* Run Metadata */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>Run Information</CardTitle>
                  <CardDescription>Details about this job search run</CardDescription>
                </div>
                {getStatusBadge(run.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Jobs Found</p>
                  <p className="text-2xl font-bold">{run.jobs.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Started</p>
                  <p className="text-lg font-semibold">{formatDate(run.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-lg font-semibold">
                    {run.completedAt ? formatDate(run.completedAt) : (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        In progress...
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jobs List */}
          {run.jobs.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-10 pb-10 text-center">
                <BriefcaseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  This search didn't find any matching jobs. Try adjusting your criteria or wait for the search to complete.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {run.jobs
                .sort((a, b) => b.score - a.score)
                .map((job) => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BuildingIcon className="h-4 w-4" />
                              {job.company}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              {job.location}
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getScoreColor(job.score)}`}>
                          <AwardIcon className="h-5 w-5" />
                          <span className="text-2xl font-bold">{job.score}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="details" className="border-none">
                          <AccordionTrigger className="hover:no-underline py-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <FileTextIcon className="h-4 w-4" />
                              View Details
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-6 pt-4">
                            {/* Job Description */}
                            <div className="space-y-2">
                              <h4 className="font-semibold flex items-center gap-2">
                                <BriefcaseIcon className="h-4 w-4" />
                                Job Description
                              </h4>
                              <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-4 max-h-48 overflow-y-auto">
                                <p className="whitespace-pre-wrap">{job.description.slice(0, 800)}...</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Cover Letter */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <FileTextIcon className="h-4 w-4" />
                                  Cover Letter
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(job.coverLetter, 'Cover letter')}
                                >
                                  <CopyIcon className="h-3 w-3 mr-2" />
                                  Copy
                                </Button>
                              </div>
                              <div className="text-sm bg-muted/30 rounded-lg p-4">
                                <p className="whitespace-pre-wrap">{job.coverLetter}</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Email Draft */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <MailIcon className="h-4 w-4" />
                                  Email to Hiring Manager
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(job.mailDraft, 'Email draft')}
                                >
                                  <CopyIcon className="h-3 w-3 mr-2" />
                                  Copy
                                </Button>
                              </div>
                              <div className="text-sm bg-muted/30 rounded-lg p-4">
                                <p className="whitespace-pre-wrap">{job.mailDraft}</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Apply Button */}
                            <div className="flex justify-end">
                              <Button asChild size="lg">
                                <a
                                  href={job.applyLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Apply on LinkedIn
                                  <ExternalLinkIcon className="h-4 w-4 ml-2" />
                                </a>
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
