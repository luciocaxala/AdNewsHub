// scripts/payout.js
// Script for scheduled payout: calculates platform revenue from impressions and optionally creates a transfer.
// Requires environment variables:
// - STRIPE_SECRET_KEY (platform secret key)
// - DATABASE_URL
// - PLATFORM_CONNECTED_ACCOUNT_ID (destination connected account id for owner)
const { Pool } = require('pg');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    // Example calculation: platform keeps $0.01 per impression for paid ads (configurable)
    const cpmPerImpression = 0.01; // $0.01 per impression
    const res = await pool.query(`SELECT a.id, a.title, a.paid, COUNT(i.id) AS impressions
      FROM ads a LEFT JOIN impressions i ON a.id = i.ad_id
      WHERE a.paid = true
      GROUP BY a.id`);
    let totalCents = 0;
    for (const row of res.rows) {
      const impressions = parseInt(row.impressions || 0, 10);
      const revenue = impressions * cpmPerImpression;
      totalCents += Math.round(revenue * 100);
      console.log(`Ad ${row.id} - impressions: ${impressions} revenue: $${revenue.toFixed(2)}`);
    }
    console.log('Total platform revenue (cents):', totalCents);
    if (totalCents <= 0) {
      console.log('Nothing to transfer.');
      await pool.end();
      return;
    }
    const destination = process.env.PLATFORM_CONNECTED_ACCOUNT_ID;
    if (!destination) {
      console.error('PLATFORM_CONNECTED_ACCOUNT_ID not set. Cannot transfer automatically.');
      await pool.end();
      return;
    }
    // Create a transfer to connected account
    const transfer = await stripe.transfers.create({
      amount: totalCents,
      currency: 'usd',
      destination: destination,
      description: 'Automated payout - platform revenue'
    });
    console.log('Transfer created:', transfer.id);
    await pool.end();
  } catch (err) {
    console.error('Error in payout script', err);
    process.exit(1);
  }
}

main();
