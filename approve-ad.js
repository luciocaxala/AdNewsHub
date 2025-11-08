const { Pool } = require('pg');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { id } = req.body || {};
  if (!process.env.DATABASE_URL) return res.status(500).json({ ok: false, error: 'No DB configured' });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query('UPDATE ads SET approved = true WHERE id = $1', [id]);
    await pool.end();
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ ok:false }); }
};
