import { createServerClient, createServiceClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { CreateRunRequest, N8nWebhookPayload } from '@/lib/types';

// Validation schema for filters
const filtersSchema = z.object({
  keywords: z.string().min(1, 'Keywords are required'),
  location: z.string().min(1, 'Location is required'),
  experienceLevel: z.array(z.string()).min(1, 'Select at least one experience level'),
  remote: z.array(z.string()).min(1, 'Select at least one work type'),
  jobType: z.array(z.string()).min(1, 'Select at least one job type'),
  easyApply: z.boolean(),
  minScore: z.number().min(0).max(100).optional().default(50)
});

/**
 * POST /api/runs
 * Create a new job search run and trigger n8n workflow
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body: CreateRunRequest = await request.json();
    const validationResult = filtersSchema.safeParse(body.filters);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid filters', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const filters = validationResult.data;

    // 3. Check if user has uploaded a resume (use service role to bypass RLS)
    const serviceSupabase = createServiceClient();
    const { data: files, error: listError } = await serviceSupabase.storage
      .from('resumes')
      .list(`${user.id}/`);

    if (listError || !files || files.length === 0) {
      return NextResponse.json(
        { error: 'Resume not uploaded. Please upload your resume first.' },
        { status: 400 }
      );
    }

    // 4. Create run record
    const { data: run, error: runError } = await supabase
      .from('runs')
      .insert({
        user_id: user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (runError || !run) {
      console.error('Failed to create run:', runError);
      return NextResponse.json(
        { error: 'Failed to create job search run' },
        { status: 500 }
      );
    }

    // 5. Generate signed URL for resume (valid for 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('resumes')
      .createSignedUrl(`${user.id}/resume.pdf`, 3600);

    if (signedUrlError || !signedUrlData) {
      console.error('Failed to generate signed URL:', signedUrlError);
      // Mark run as failed
      await supabase
        .from('runs')
        .update({ status: 'failed' })
        .eq('id', run.id);

      return NextResponse.json(
        { error: 'Failed to access resume' },
        { status: 500 }
      );
    }

    // 6. Prepare n8n webhook payload
    const n8nPayload: N8nWebhookPayload = {
      runId: run.id,
      userId: user.id,
      resumeUrl: signedUrlData.signedUrl,
      filters: {
        keywords: filters.keywords,
        location: filters.location,
        experienceLevel: filters.experienceLevel.join(','),
        remote: filters.remote.join(','),
        jobType: filters.jobType.join(','),
        easyApply: filters.easyApply,
        minScore: filters.minScore
      }
    };

    // 7. Trigger n8n webhook
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(n8nPayload)
    });

    if (!n8nResponse.ok) {
      console.error('n8n webhook failed:', await n8nResponse.text());
      // Mark run as failed
      await supabase
        .from('runs')
        .update({ status: 'failed' })
        .eq('id', run.id);

      return NextResponse.json(
        { error: 'Failed to trigger job search workflow' },
        { status: 500 }
      );
    }

    // 8. Update run status to processing
    const { error: updateError } = await supabase
      .from('runs')
      .update({ status: 'processing' })
      .eq('id', run.id);

    if (updateError) {
      console.error('Failed to update run status:', updateError);
      // Don't fail the request, run is already created and n8n is triggered
    }

    // 9. Return run ID
    return NextResponse.json(
      { runId: run.id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error in POST /api/runs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/runs
 * Get all runs for the authenticated user
 */
export async function GET() {
  try {
    const supabase = await createServerClient();

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Fetch runs with job counts
    const { data: runs, error: runsError } = await supabase
      .from('runs')
      .select(`
        id,
        status,
        created_at,
        completed_at,
        jobs!jobs_run_id_fkey (count)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (runsError) {
      console.error('Failed to fetch runs:', runsError);
      return NextResponse.json(
        { error: 'Failed to fetch job search runs' },
        { status: 500 }
      );
    }

    // 3. Transform response to include job counts
    const runsWithCounts = runs?.map(run => ({
      id: run.id,
      status: run.status,
      createdAt: run.created_at,
      completedAt: run.completed_at,
      jobCount: Array.isArray(run.jobs) && run.jobs.length > 0
        ? (run.jobs[0] as any).count || 0
        : 0
    })) || [];

    return NextResponse.json({ runs: runsWithCounts });

  } catch (error) {
    console.error('Unexpected error in GET /api/runs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
