import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BriefcaseIcon,
  SparklesIcon,
  RocketIcon,
  TargetIcon,
  FileTextIcon,
  ZapIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  UploadIcon,
  SlidersIcon,
  BotIcon,
  MailIcon
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              JobPilot
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="outline" className="mx-auto">
            <SparklesIcon className="h-3 w-3 mr-1" />
            AI-Powered Job Search
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Automate Your Job Search
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              With AI Precision
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find relevant jobs, get AI-powered match scores, and generate personalized cover letters automatically.
            Let JobPilot handle the heavy lifting while you focus on landing your dream job.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                <RocketIcon className="h-4 w-4 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Dashboard
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Get started in 4 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                  <UploadIcon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Upload Resume</CardTitle>
                <CardDescription>
                  Upload your resume in PDF format once during signup
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 mb-4">
                  <SlidersIcon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Set Filters</CardTitle>
                <CardDescription>
                  Configure job search criteria: keywords, location, and experience level
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 mb-4">
                  <BotIcon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">AI Finds Jobs</CardTitle>
                <CardDescription>
                  AI searches LinkedIn and scores each job (0-100) against your resume
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 mb-4">
                  <FileTextIcon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Get Materials</CardTitle>
                <CardDescription>
                  Receive tailored cover letters and hiring manager emails for each match
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to streamline your job search
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4">
                  <TargetIcon className="h-6 w-6" />
                </div>
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  Advanced AI analyzes job descriptions and scores them against your experience, skills, and career goals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mb-4">
                  <MailIcon className="h-6 w-6" />
                </div>
                <CardTitle>Auto-Generated Content</CardTitle>
                <CardDescription>
                  Get custom cover letters and personalized hiring manager emails for each job opportunity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-4">
                  <ZapIcon className="h-6 w-6" />
                </div>
                <CardTitle>Async Processing</CardTitle>
                <CardDescription>
                  Searches run in the background. Start a search and check back in minutes for your results
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Choose JobPilot?
              </h2>
              <p className="text-lg text-muted-foreground">
                Stop wasting hours searching for jobs and crafting applications. Let AI do the work for you.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2Icon className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Save 10+ Hours Per Week</h3>
                    <p className="text-muted-foreground">
                      Automate the tedious parts of job searching and focus on what matters
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2Icon className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Increase Response Rates</h3>
                    <p className="text-muted-foreground">
                      Personalized applications get 3x more responses than generic ones
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2Icon className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Never Miss an Opportunity</h3>
                    <p className="text-muted-foreground">
                      Get notified of the best matches as soon as they're posted
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl transform rotate-3" />
              <Card className="relative">
                <CardHeader>
                  <CardTitle>Ready to get started?</CardTitle>
                  <CardDescription>
                    Join thousands of job seekers who've automated their search
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <div className="text-5xl font-bold text-blue-600 mb-2">Free</div>
                    <p className="text-muted-foreground">Forever. No credit card required.</p>
                  </div>
                  <Link href="/signup" className="block">
                    <Button size="lg" className="w-full">
                      Create Free Account
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                  <span className="font-bold">JobPilot</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automate your job search with AI-powered precision
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                  <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                  <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                  <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>Built with Next.js 14, Supabase, and n8n • © 2025 JobPilot. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
