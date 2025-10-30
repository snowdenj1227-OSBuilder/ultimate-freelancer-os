import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { updateInvoiceStatus } from '@/lib/notion/mutations';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')!;
  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'charge.succeeded':
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        const invoiceId = paymentIntent.metadata?.invoiceId;

        if (invoiceId) {
          await updateInvoiceStatus(invoiceId, 'Paid', paymentIntent.id);
        }
        break;
      }

      case 'charge.failed':
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        const invoiceId = paymentIntent.metadata?.invoiceId;

        if (invoiceId) {
          await updateInvoiceStatus(invoiceId, 'Sent');
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}