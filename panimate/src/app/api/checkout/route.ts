import { NextResponse } from 'next/server';

// Note: Set STRIPE_SECRET_KEY in Vercel environment variables
// Get keys from https://dashboard.stripe.com/apikeys

export async function POST(request: Request) {
  const body = await request.json();
  const { priceId, customAmount, customerEmail } = body;

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Payment system not configured. Please contact support.' },
      { status: 500 }
    );
  }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    let lineItems;

    if (priceId) {
      // Subscription or predefined product
      lineItems = [{ price: priceId, quantity: 1 }];
    } else if (customAmount) {
      // Custom amount (for one-time payments like custom cards)
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Custom Animated Card',
            description: 'Personalized AI animated greeting card',
          },
          unit_amount: Math.round(customAmount * 100), // Convert to cents
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: priceId ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://panimate-eosin.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://panimate-eosin.vercel.app'}/cancel`,
      customer_email: customerEmail,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment failed' },
      { status: 500 }
    );
  }
}
