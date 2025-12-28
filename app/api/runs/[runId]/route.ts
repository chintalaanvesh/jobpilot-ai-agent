import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/runs/[runId]
 * Get details of a specific run with all matched jobs
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { runId } = await params;

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const minScore = searchParams.get('minScore');
    const remoteOnly = searchParams.get('remoteOnly') === 'true';

    // 3. Fetch run with jobs
    let query = supabase
      .from('runs')
      .select(`
        id,
        status,
        created_at,
        completed_at,
        jobs!jobs_run_id_fkey (
          id,
          title,
          company,
          location,
          score,
          description,
          apply_link,
          cover_letter,
          mail_draft,
          created_at
        )
      `)
      .eq('id', runId)
      .eq('user_id', user.id)
      .single();

    const { data: run, error: runError } = await query;

    if (runError) {
      if (runError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Run not found' },
          { status: 404 }
        );
      }
      console.error('Failed to fetch run:', runError);
      return NextResponse.json(
        { error: 'Failed to fetch run details' },
        { status: 500 }
      );
    }

    // 4. Filter and sort jobs
    let jobs = run.jobs || [];

    // Apply minScore filter
    if (minScore) {
      const minScoreNum = parseInt(minScore, 10);
      if (!isNaN(minScoreNum)) {
        jobs = jobs.filter(job => job.score >= minScoreNum);
      }
    }

    // Apply remoteOnly filter
    if (remoteOnly) {
      jobs = jobs.filter(job =>
        job.location?.toLowerCase().includes('remote')
      );
    }

    // Sort by score (descending)
    jobs.sort((a, b) => b.score - a.score);

    // 5. Transform response
    const response = {
      id: run.id,
      status: run.status,
      createdAt: run.created_at,
      completedAt: run.completed_at,
      jobs: jobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        score: job.score,
        description: job.description,
        applyLink: job.apply_link,
        coverLetter: job.cover_letter,
        mailDraft: job.mail_draft,
        createdAt: job.created_at
      }))
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Unexpected error in GET /api/runs/[runId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
