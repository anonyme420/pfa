import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessionId = request.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 });
  }

  const n8nBase = process.env.N8N_WEBHOOK_URL;
  if (!n8nBase) {
    return NextResponse.json({ error: 'N8N_WEBHOOK_URL not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `${n8nBase}/travel-status?session_id=${encodeURIComponent(sessionId)}`,
      { signal: AbortSignal.timeout(15_000) },
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[travel/status] n8n poll failed:', err?.message);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
  }
}
