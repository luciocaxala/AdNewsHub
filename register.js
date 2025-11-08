const { Pool } = require('pg');
const { hashPassword } = require('../../../lib/hash.js') || require('../../../lib/hash'); // for linter
const hash = require('../../../lib/hash.js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok:false, error:'missing' });
  if (!process.env.DATABASE_URL) return res.status(500).json({ ok:false, error:'no db' });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const ph = hash.hashPassword(password);
    await pool.query('INSERT INTO admins (email, password_hash) VALUES ($1,$2)', [email, ph]);
    await pool.end();
    res.json({ ok:true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error: 'db' });
  }
};
