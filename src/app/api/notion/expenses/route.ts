import { NextRequest, NextResponse } from 'next/server';
import { getExpenses } from '@/lib/notion/queries';
import { createExpense } from '@/lib/notion/mutations';

export async function GET(request: NextRequest) {
  try {
    const expenses = await getExpenses();
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const expense = await createExpense(data);
    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}