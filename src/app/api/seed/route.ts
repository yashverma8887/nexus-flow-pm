import { NextResponse } from 'next/server';
import { resetStore } from '@/lib/store';

export async function POST() {
  try {
    const store = resetStore();
    return NextResponse.json({
      success: true,
      message: 'Workspace restored to pristine initial sprint state',
      boardsCount: store.boards.length,
      tasksCount: store.tasks.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Reset failed' }, { status: 500 });
  }
}
