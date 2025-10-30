import { NextRequest, NextResponse } from 'next/server';
import { getClients } from '@/lib/notion/queries';

export async function GET(request: NextRequest) {
  try {
    const clients = await getClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}