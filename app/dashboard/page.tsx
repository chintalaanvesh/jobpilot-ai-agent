'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BriefcaseIcon,
  PlusCircleIcon,
  Settings2Icon,
  LogOutIcon,
  UserCircleIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircle2Icon,
  Loader2Icon,
  XCircleIcon
} from 'lucide-react';

interface Run {
  id: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  jobCount: number;
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

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      await fetchRuns();
    }
    setLoading(false);
  }

  async function fetchRuns() {
    try {
      const response = await fetch('/api/runs');
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to fetch runs');
        return;
      }

      setRuns(data.runs || []);
    } catch (error) {
      console.error('Error fetching runs:', error);
      toast.error('An unexpected error occurred');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              JobPilot
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard/new">
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                New Search
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserCircleIcon className="h-5 w-5" />
                  <span className="hidden md:inline text-sm">{user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings2Icon className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Your Job Searches</h2>
            <p className="text-muted-foreground">
              Track and manage your automated job search runs
            </p>
          </div>

          {/* Stats Cards */}
          {runs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Searches</CardDescription>
                  <CardTitle className="text-3xl">{runs.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Jobs Found</CardDescription>
                  <CardTitle className="text-3xl">
                    {runs.reduce((sum, run) => sum + run.jobCount, 0)}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Completed</CardDescription>
                  <CardTitle className="text-3xl">
                    {runs.filter(run => run.status === 'completed').length}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Runs List */}
          {runs.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                    <BriefcaseIcon className="h-10 w-10 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No job searches yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Get started by creating your first automated job search. We'll find relevant jobs,
                      score them against your resume, and generate personalized cover letters for you.
                    </p>
                  </div>
                  <Button asChild size="lg">
                    <Link href="/dashboard/new">
                      <PlusCircleIcon className="h-5 w-5 mr-2" />
                      Create Your First Search
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {runs.map((run) => (
                <Link key={run.id} href={`/dashboard/runs/${run.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        {getStatusBadge(run.status)}
                        {run.jobCount > 0 && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <TrendingUpIcon className="h-4 w-4" />
                            <span className="text-2xl font-bold">{run.jobCount}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Started</span>
                          <span className="font-medium">{formatDate(run.createdAt)}</span>
                        </div>
                        {run.completedAt && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Completed</span>
                            <span className="font-medium">{formatDate(run.completedAt)}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          {run.jobCount === 0 ? (
                            run.status === 'processing' ? (
                              <>
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                                Processing jobs...
                              </>
                            ) : (
                              'No jobs found'
                            )
                          ) : (
                            `${run.jobCount} ${run.jobCount === 1 ? 'job' : 'jobs'} found`
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
