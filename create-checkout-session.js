const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { ad } = req.body;
    if (!ad) return res.status(400).json({ error: 'Ad missing' });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'AdNewsHub - Impulsionar anúncio' },
          unit_amount: 1000,
        },
        quantity: 1
      }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel`,
      metadata: { ad: JSON.stringify(ad) }
    });
    res.json({ url: session.url });
  } catch (err) { console.error(err); res.status(500).json({ error: 'stripe error' }); }
};
