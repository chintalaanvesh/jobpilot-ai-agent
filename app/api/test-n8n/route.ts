import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/test-n8n
 * Test endpoint to simulate n8n callback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Test n8n webhook received:', JSON.stringify(body, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Test webhook received successfully',
      receivedPayload: body
    });
  } catch (error) {
    console.error('Error in test webhook:', error);
    return NextResponse.json(
      { error: 'Failed to parse request' },
      { status: 400 }
    );
  }
}
