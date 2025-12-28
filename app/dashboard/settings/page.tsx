'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [hasResume, setHasResume] = useState<boolean | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [checking, setChecking] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    setChecking(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      setUser(user);
      await checkResume(user.id);
    }
    setChecking(false);
  }

  async function checkResume(userId: string) {
    try {
      const { data: files, error } = await supabase.storage
        .from('resumes')
        .list(`${userId}/`);

      if (error) {
        console.error('Error checking resume:', error);
        setHasResume(false);
        return;
      }

      const resumeExists = files && files.length > 0 && files.some(f => f.name === 'resume.pdf');
      setHasResume(resumeExists);
    } catch (error) {
      console.error('Error:', error);
      setHasResume(false);
    }
  }

  async function handleUpload() {
    if (!resumeFile || !user) {
      toast.error('Please select a resume file');
      return;
    }

    setUploading(true);

    try {
      const { error } = await supabase.storage
        .from('resumes')
        .upload(`${user.id}/resume.pdf`, resumeFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload resume. Error: ' + error.message);
        return;
      }

      toast.success('Resume uploaded successfully!');
      setHasResume(true);
      setResumeFile(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking resume status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

          {/* Resume Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Resume Status</h2>

            {hasResume === null ? (
              <p className="text-gray-600">Checking...</p>
            ) : hasResume ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-900">Resume uploaded ✓</p>
                    <p className="text-sm text-green-700">Your resume is stored securely and ready to use</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-900">No resume found</p>
                    <p className="text-sm text-red-700">Please upload your resume below to start job searches</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upload Resume */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {hasResume ? 'Replace Resume' : 'Upload Resume'}
            </h2>
            <p className="text-gray-600 mb-4">
              {hasResume
                ? 'Upload a new resume to replace your existing one. This will be used for all future job searches.'
                : 'Upload your resume in PDF format. This will be used to match you with relevant jobs and generate application materials.'
              }
            </p>

            <ResumeUpload onFileSelect={setResumeFile} disabled={uploading} />

            {resumeFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Resume'}
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-mono text-xs text-gray-600">{user?.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
