import { NextResponse } from 'next/server';
import { createTask, getTasksByBoard } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId') || 'board_01';
    const tasks = getTasksByBoard(boardId);
    return NextResponse.json({ success: true, count: tasks.length, tasks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }
    const newTask = createTask(data);
    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
