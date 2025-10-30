import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/checkout';
import { updateInvoiceStatus } from '@/lib/notion/mutations';

export async function POST(request: NextRequest) {
  try {
    const { invoiceId, amount, clientEmail } = await request.json();

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await createCheckoutSession({
      invoiceId,
      amount,
      clientEmail,
      successUrl: `${origin}/invoices/${invoiceId}?payment=success`,
      cancelUrl: `${origin}/invoices/${invoiceId}?payment=cancelled`,
    });

    // Update invoice with Stripe session ID
    await updateInvoiceStatus(invoiceId, 'Sent', session.id);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}