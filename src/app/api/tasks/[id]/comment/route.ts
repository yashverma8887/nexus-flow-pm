import { NextResponse } from 'next/server';
import { addCommentToTask } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { author, content } = await request.json();
    if (!author || !content) {
      return NextResponse.json({ error: 'Author and comment content are required' }, { status: 400 });
    }

    const updatedTask = addCommentToTask(params.id, author, content);
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
