import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const n8nBase = process.env.N8N_WEBHOOK_URL;
  if (!n8nBase) {
    return NextResponse.json({ error: 'N8N_WEBHOOK_URL not configured' }, { status: 500 });
  }

  const body = await request.json();

  try {
    const res = await fetch(`${n8nBase}/travel-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: (session.user as any).id ?? session.user.email,
        message: body.message,
        session_id: body.session_id ?? undefined,
      }),
      signal: AbortSignal.timeout(120_000),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    const isTimeout = err?.name === 'TimeoutError' || err?.name === 'AbortError';
    console.error('[travel] n8n request failed:', err?.name, err?.message);
    return NextResponse.json(
      { error: isTimeout ? 'n8n did not respond in time — retrying is safe' : 'AI service unavailable' },
      { status: 502 },
    );
  }
}
