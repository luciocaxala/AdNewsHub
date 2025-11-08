const Stripe = require('stripe');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { amount_cents, connectedAccountId } = req.body || {};
  if (!amount_cents || !connectedAccountId) return res.status(400).json({ ok:false, error:'missing' });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    // create a transfer from platform balance to connected account
    const transfer = await stripe.transfers.create({
      amount: amount_cents,
      currency: 'usd',
      destination: connectedAccountId,
    });
    res.json({ ok:true, transfer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error: err.message });
  }
};
