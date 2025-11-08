const { Pool } = require('pg');
module.exports = async (req, res) => {
  const { ad_id } = req.query;
  if (!ad_id) return res.status(400).json({ ok:false });
  if (!process.env.DATABASE_URL) return res.status(200).json({ ok:true, note:'no db' });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query('INSERT INTO impressions (ad_id) VALUES ($1)', [ad_id]);
    await pool.end();
    res.json({ ok:true });
  } catch (err) { console.error(err); res.status(500).json({ ok:false }); }
};
