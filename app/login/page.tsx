import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { BriefcaseIcon, ArrowLeftIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <BriefcaseIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              JobPilot
            </h1>
          </Link>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Log in to your account to continue your job search
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
