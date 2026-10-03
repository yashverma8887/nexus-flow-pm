import { NextResponse } from 'next/server';
import { getBoardStats } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const stats = getBoardStats(params.id);
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
