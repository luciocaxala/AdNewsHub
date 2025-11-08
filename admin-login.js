const crypto = require('crypto');
const { Pool } = require('pg');
const hash = require('../../lib/hash.js');

function createToken(payload, secret) {
  const p = Buffer.from(JSON.stringify(payload)).toString('base64');
  const sig = crypto.createHmac('sha256', secret).update(p).digest('hex');
  return p + '.' + sig;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok:false });
  if (!process.env.DATABASE_URL) return res.status(500).json({ ok:false, error:'no db' });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const r = await pool.query('SELECT id, password_hash FROM admins WHERE email = $1', [email]);
    await pool.end();
    if (!r.rows[0]) return res.status(401).json({ ok:false });
    const ph = r.rows[0].password_hash;
    if (!hash.verifyPassword(password, ph)) return res.status(401).json({ ok:false });
    const payload = { id: r.rows[0].id, email, ts: Date.now() };
    const token = createToken(payload, process.env.ADMIN_SESSION_SECRET || 'secret');
    res.setHeader('Set-Cookie', `admin_session=${token}; HttpOnly; Path=/; Max-Age=86400`);
    res.json({ ok:true });
  } catch (err) { console.error(err); res.status(500).json({ ok:false }); }
};
