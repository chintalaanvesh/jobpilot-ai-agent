import { createServiceClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { N8nCallbackPayload } from '@/lib/types';

/**
 * POST /api/webhooks/n8n
 * Receive job search results from n8n workflow
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Validate webhook secret
    const providedSecret = request.headers.get('x-webhook-secret');

    if (!providedSecret || providedSecret !== process.env.N8N_WEBHOOK_SECRET) {
      console.error('Invalid webhook secret');
      return NextResponse.json(
        { error: 'Invalid webhook secret' },
        { status: 403 }
      );
    }

    // 2. Parse request body
    const body: N8nCallbackPayload = await request.json();

    if (!body.runId || !body.jobs || !Array.isArray(body.jobs)) {
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      );
    }

    // 3. Use service client to bypass RLS
    const supabase = createServiceClient();

    // 4. Verify run exists and is in processing state
    const { data: run, error: runError } = await supabase
      .from('runs')
      .select('id, status')
      .eq('id', body.runId)
      .single();

    if (runError || !run) {
      console.error('Run not found:', body.runId, runError);
      return NextResponse.json(
        { error: 'Run not found' },
        { status: 404 }
      );
    }

    if (run.status !== 'processing' && run.status !== 'pending') {
      console.warn('Run is not in processing state:', run.status);
      // Still accept the webhook to avoid n8n retries
      return NextResponse.json({ success: true });
    }

    // 5. Insert jobs in batch
    if (body.jobs.length > 0) {
      const jobRecords = body.jobs.map(job => ({
        run_id: body.runId,
        title: job.title,
        company: job.company,
        location: job.location || '',
        score: job.score,
        description: job.description,
        apply_link: job.applyLink,
        cover_letter: job.coverLetter,
        mail_draft: job.mailDraft
      }));

      const { error: insertError } = await supabase
        .from('jobs')
        .insert(jobRecords);

      if (insertError) {
        console.error('Failed to insert jobs:', insertError);
        return NextResponse.json(
          { error: 'Failed to save job results' },
          { status: 500 }
        );
      }
    }

    // 6. Update run status to completed
    const { error: updateError } = await supabase
      .from('runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', body.runId);

    if (updateError) {
      console.error('Failed to update run status:', updateError);
      // Don't fail the request, jobs are already inserted
    }

    console.log(`Successfully processed webhook for run ${body.runId}, inserted ${body.jobs.length} jobs`);

    return NextResponse.json({
      success: true,
      jobsInserted: body.jobs.length
    });

  } catch (error) {
    console.error('Unexpected error in POST /api/webhooks/n8n:', error);
    // Always return 200 to prevent n8n from retrying
    // Log the error for manual investigation
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 200 }
    );
  }
}
