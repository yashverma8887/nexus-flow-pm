import { NextResponse } from 'next/server';
import { toggleSubtask } from '@/lib/store';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { subtaskId } = await request.json();
    if (!subtaskId) {
      return NextResponse.json({ error: 'subtaskId is required' }, { status: 400 });
    }

    const updatedTask = toggleSubtask(params.id, subtaskId);
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task or subtask not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
