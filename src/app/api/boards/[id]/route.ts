import { NextResponse } from 'next/server';
import { getBoardById, getTasksByBoard } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const board = getBoardById(params.id);
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    const tasks = getTasksByBoard(params.id);
    return NextResponse.json({ success: true, board, tasks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
