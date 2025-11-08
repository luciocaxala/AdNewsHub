const { Pool } = require('pg');
module.exports = async (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.json({ ads: [{ id: 1, title: 'Exemplo', url: '#', description:'Ex', image:'', paid: true, approved:true }] });
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const r = await pool.query('SELECT id, title, url, description, image, paid, approved FROM ads WHERE approved = true ORDER BY created_at DESC LIMIT 50');
    await pool.end();
    res.json({ ads: r.rows });
  } catch (err) { console.error(err); res.status(500).json({ ads: [] }); }
};
