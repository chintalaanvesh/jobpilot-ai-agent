'use server';

import { createServerClient, createServiceClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signupWithResume(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const resumeFile = formData.get('resume') as File;

  if (!email || !password || !resumeFile) {
    return { error: 'Missing required fields' };
  }

  try {
    // 1. Create auth user with regular client
    const supabase = await createServerClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: 'Failed to create user' };
    }

    // 2. Upload resume using service role (bypasses RLS)
    const serviceSupabase = createServiceClient();

    const { error: uploadError } = await serviceSupabase.storage
      .from('resumes')
      .upload(`${authData.user.id}/resume.pdf`, resumeFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Resume upload error:', uploadError);
      return { error: 'Failed to upload resume' };
    }

    // 3. Create profile record using service role
    const { error: profileError } = await serviceSupabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail signup if profile creation fails
    }

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'An unexpected error occurred' };
  }
}
