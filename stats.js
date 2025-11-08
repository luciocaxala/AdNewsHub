const { Pool } = require('pg');
module.exports = async (req, res) => {
  if (!process.env.DATABASE_URL) return res.status(500).json({ ok:false, error:'no db' });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    // impressions per ad
    const r = await pool.query(`SELECT a.id, a.title, a.paid, COUNT(i.id) AS impressions
      FROM ads a LEFT JOIN impressions i ON a.id = i.ad_id
      GROUP BY a.id ORDER BY impressions DESC`);
    // calculate revenue: Suppose platform earns $0.01 per impression for paid ads (example)
    const rows = r.rows.map(row=>{
      const impressions = parseInt(row.impressions || 0);
      const rev = row.paid ? impressions * 0.01 : 0; // $0.01 per view for paid ads
      return { id: row.id, title: row.title, paid: row.paid, impressions, revenue: rev.toFixed(2) };
    });
    await pool.end();
    res.json({ ok:true, rows });
  } catch (err) { console.error(err); res.status(500).json({ ok:false }); }
};
