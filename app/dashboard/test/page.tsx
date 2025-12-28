'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const router = useRouter();

  async function triggerJobSearch() {
    setLoading(true);
    setRunId(null);

    try {
      // Sample filters for testing
      const filters = {
        keywords: 'Product Manager',
        location: 'Bangalore',
        experienceLevel: ['Entry level', 'Mid-Senior level'],
        remote: ['Remote', 'Hybrid'],
        jobType: ['Full-time'],
        easyApply: true,
        minScore: 50
      };

      const response = await fetch('/api/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filters })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to create job search');
        return;
      }

      toast.success('Job search started! n8n is processing...');
      setRunId(data.runId);

    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function testWebhook() {
    if (!runId) {
      toast.error('No run ID available. Create a run first.');
      return;
    }

    setLoading(true);

    try {
      // Simulate n8n webhook callback with test data
      const testPayload = {
        runId: runId,
        secret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET || 'jobpilot_webhook_secret_2025_secure_key_change_in_production',
        jobs: [
          {
            title: 'Senior Product Manager',
            company: 'Test Company Inc',
            location: 'Bangalore, Karnataka, India (Remote)',
            score: 85,
            description: 'This is a test job description. We are looking for an experienced Product Manager...',
            applyLink: 'https://www.linkedin.com/jobs/view/test123',
            coverLetter: 'Dear Hiring Manager,\n\nI am writing to express my interest in the Senior Product Manager position...',
            mailDraft: 'I know you are super busy so I will keep this short.\n\nI noticed your posting and believe my experience aligns well...\n\nPlease find my resume attached.'
          },
          {
            title: 'Product Manager',
            company: 'Another Test Corp',
            location: 'Bangalore, Karnataka, India (Hybrid)',
            score: 72,
            description: 'Another test job description...',
            applyLink: 'https://www.linkedin.com/jobs/view/test456',
            coverLetter: 'Dear Hiring Manager,\n\nI am excited to apply for this position...',
            mailDraft: 'I know you are super busy so I will keep this short.\n\nYour posting caught my attention...\n\nPlease find my resume attached.'
          }
        ]
      };

      const response = await fetch('/api/webhooks/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': testPayload.secret
        },
        body: JSON.stringify(testPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Webhook test failed');
        return;
      }

      toast.success(`Webhook test successful! ${data.jobsInserted} jobs inserted`);

      // Redirect to view the run
      router.push(`/dashboard/runs/${runId}`);

    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            API Test Page
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Test 1: Create Job Search Run</h2>
              <p className="text-gray-600 mb-4">
                This will call POST /api/runs to create a new run and trigger n8n.
              </p>
              <button
                onClick={triggerJobSearch}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Job Search Run'}
              </button>
              {runId && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-semibold text-green-900">Run Created!</p>
                  <p className="text-sm text-green-700 mt-1">Run ID: {runId}</p>
                  <p className="text-sm text-green-700">Status: processing</p>
                </div>
              )}
            </div>

            <hr />

            <div>
              <h2 className="text-xl font-semibold mb-4">Test 2: Simulate n8n Webhook Callback</h2>
              <p className="text-gray-600 mb-4">
                This will simulate n8n sending job results back to our webhook endpoint.
              </p>
              <button
                onClick={testWebhook}
                disabled={loading || !runId}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Test Webhook Callback'}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Note: You must create a run first before testing the webhook.
              </p>
            </div>

            <hr />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Testing Flow:</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                <li>Click "Create Job Search Run" to trigger n8n</li>
                <li>Wait a few seconds</li>
                <li>Click "Test Webhook Callback" to simulate n8n results</li>
                <li>You'll be redirected to view the run with test jobs</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Note:</h3>
              <p className="text-yellow-800 text-sm">
                In production, n8n will automatically call the webhook after processing.
                This test page manually simulates that callback for testing purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
