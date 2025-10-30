import { NextRequest, NextResponse } from 'next/server';
import { getTimeEntries } from '@/lib/notion/queries';
import { createTimeEntry } from '@/lib/notion/mutations';

export async function GET(request: NextRequest) {
  try {
    const entries = await getTimeEntries();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const entry = await createTimeEntry(data);
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json({ error: 'Failed to create time entry' }, { status: 500 });
  }
}