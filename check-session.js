const crypto = require('crypto');
function verifyToken(token, secret) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const payloadB = parts[0];
  const sig = parts[1];
  try {
    const expected = crypto.createHmac('sha256', secret).update(payloadB).digest('hex');
    return expected === sig;
  } catch (e) { return false; }
}
module.exports = async (req, res) => {
  const cookies = req.headers.cookie || '';
  const match = cookies.split(';').map(c=>c.trim()).find(c=>c.startsWith('admin_session='));
  const token = match ? match.split('=')[1] : null;
  const ok = verifyToken(token, process.env.ADMIN_SESSION_SECRET || 'secret');
  res.json({ logged: ok });
};
