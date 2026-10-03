import { NextResponse } from 'next/server';
import { getBoards, createBoard } from '@/lib/store';

export async function GET() {
  try {
    const boards = getBoards();
    return NextResponse.json({ success: true, count: boards.length, boards });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const newBoard = createBoard(data);
    return NextResponse.json({ success: true, board: newBoard }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
