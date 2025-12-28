'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  BriefcaseIcon,
  ArrowLeftIcon,
  Loader2Icon,
  SearchIcon,
  MapPinIcon,
  TargetIcon,
  BotIcon,
  FileTextIcon,
  MailIcon,
  SparklesIcon
} from 'lucide-react';

export default function NewJobSearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    keywords: '',
    location: '',
    experienceLevel: [] as string[],
    remote: [] as string[],
    jobType: [] as string[],
    easyApply: true,
    minScore: 50
  });

  const experienceLevels = ['Internship', 'Entry level', 'Associate', 'Mid-Senior level', 'Director', 'Executive'];
  const remoteOptions = ['On-site', 'Remote', 'Hybrid'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Volunteer', 'Internship'];

  function handleCheckboxChange(field: 'experienceLevel' | 'remote' | 'jobType', value: string) {
    setFormData(prev => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!formData.keywords.trim()) {
      toast.error('Please enter job keywords');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Please enter a location');
      return;
    }
    if (formData.experienceLevel.length === 0) {
      toast.error('Please select at least one experience level');
      return;
    }
    if (formData.remote.length === 0) {
      toast.error('Please select at least one work type');
      return;
    }
    if (formData.jobType.length === 0) {
      toast.error('Please select at least one job type');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filters: formData })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to create job search');
        return;
      }

      toast.success('Job search started! Processing in the background...');
      router.push(`/dashboard/runs/${data.runId}`);

    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">New Job Search</h2>
            <p className="text-muted-foreground">
              Configure your search criteria to find relevant job opportunities
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                Configure Your Search
              </CardTitle>
              <CardDescription>
                Fill in the details to find jobs that match your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Keywords */}
                <div className="space-y-2">
                  <Label htmlFor="keywords" className="flex items-center gap-2">
                    <TargetIcon className="h-4 w-4" />
                    Job Title / Keywords *
                  </Label>
                  <Input
                    id="keywords"
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="e.g., Product Manager, Software Engineer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the job title or keywords you're looking for
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Bangalore, New York, London"
                  />
                  <p className="text-xs text-muted-foreground">
                    City or region where you want to work
                  </p>
                </div>

                <Separator />

                {/* Experience Level */}
                <div className="space-y-3">
                  <Label>Experience Level * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {experienceLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`exp-${level}`}
                          checked={formData.experienceLevel.includes(level)}
                          onCheckedChange={() => handleCheckboxChange('experienceLevel', level)}
                        />
                        <Label
                          htmlFor={`exp-${level}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Type */}
                <div className="space-y-3">
                  <Label>Work Type * (Select all that apply)</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {remoteOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`remote-${option}`}
                          checked={formData.remote.includes(option)}
                          onCheckedChange={() => handleCheckboxChange('remote', option)}
                        />
                        <Label
                          htmlFor={`remote-${option}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Job Type */}
                <div className="space-y-3">
                  <Label>Employment Type * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {jobTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`job-${type}`}
                          checked={formData.jobType.includes(type)}
                          onCheckedChange={() => handleCheckboxChange('jobType', type)}
                        />
                        <Label
                          htmlFor={`job-${type}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Easy Apply */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="easyApply"
                    checked={formData.easyApply}
                    onCheckedChange={(checked) => setFormData({ ...formData, easyApply: checked as boolean })}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="easyApply" className="text-sm font-medium cursor-pointer">
                      Easy Apply only
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Only show jobs with LinkedIn's Easy Apply feature
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Minimum Score */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      <span>Minimum Match Score</span>
                      <Badge variant="secondary">{formData.minScore}%</Badge>
                    </Label>
                    <Slider
                      value={[formData.minScore]}
                      onValueChange={(value) => setFormData({ ...formData, minScore: value[0] })}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Only show jobs that match your resume at least {formData.minScore}%
                    </p>
                  </div>
                </div>

                {/* Info Box */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <SparklesIcon className="h-4 w-4 text-blue-600" />
                      What happens next?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <SearchIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p>n8n will search LinkedIn for matching jobs</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <BotIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p>AI will score each job against your resume (0-100)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileTextIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p>Personalized cover letters will be generated</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MailIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p>Hiring manager emails will be drafted for you</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <Link href="/dashboard">
                      Cancel
                    </Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                        Starting Search...
                      </>
                    ) : (
                      <>
                        <SearchIcon className="h-4 w-4 mr-2" />
                        Start Job Search
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
