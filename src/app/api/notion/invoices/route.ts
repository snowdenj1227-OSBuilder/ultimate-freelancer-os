import { NextRequest, NextResponse } from 'next/server';
import { getInvoices, createInvoice } from '@/lib/notion/queries';

export async function GET(request: NextRequest) {
  try {
    const invoices = await getInvoices();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const invoice = await createInvoice({
      ...data,
      status: 'Draft',
    });
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}