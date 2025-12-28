'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { signupWithResume } from '@/app/actions/auth';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2Icon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Use server action to handle signup with resume upload
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('resume', resumeFile);

      const result = await signupWithResume(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Check if email confirmation is required
      if (result.requiresEmailConfirmation) {
        toast.success('Account created! Please check your email to verify your account.');
        router.push('/auth/check-email');
        return;
      }

      // If no email confirmation required, sign in automatically
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        toast.error('Account created but failed to log in. Please try logging in manually.');
        router.push('/login');
        return;
      }

      toast.success('Account created successfully!');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="At least 6 characters"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Repeat your password"
          disabled={loading}
        />
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <Label>Resume (Required)</Label>
        <ResumeUpload
          onFileSelect={setResumeFile}
          disabled={loading}
        />
        <p className="text-sm text-muted-foreground">
          Your resume will be used to match you with relevant jobs and generate application materials.
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading || !resumeFile}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Login
        </Link>
      </div>
    </form>
  );
}
