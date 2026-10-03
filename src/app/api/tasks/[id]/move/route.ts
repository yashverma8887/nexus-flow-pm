import { NextResponse } from 'next/server';
import { moveTask } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { targetColumnId, targetIndex } = await request.json();
    if (!targetColumnId) {
      return NextResponse.json({ error: 'targetColumnId is required' }, { status: 400 });
    }

    const moved = moveTask(params.id, targetColumnId, targetIndex);
    if (!moved) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, task: moved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
