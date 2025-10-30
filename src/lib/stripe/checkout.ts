import { stripe } from "./client";

export async function createCheckoutSession(data: {
  invoiceId: string;
  amount: number;
  clientEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Invoice Payment",
          },
          unit_amount: Math.round(data.amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
    customer_email: data.clientEmail,
    metadata: {
      invoiceId: data.invoiceId,
    },
  });

  return session;
}