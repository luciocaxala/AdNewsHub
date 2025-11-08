const Stripe = require('stripe');
module.exports = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  try {
    // create account (Express)
    const account = await stripe.accounts.create({ type: 'express', country: 'US' });
    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${origin}/admin`,
      return_url: `${origin}/admin`,
      type: 'account_onboarding'
    });
    res.json({ url: accountLink.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe error' });
  }
};
