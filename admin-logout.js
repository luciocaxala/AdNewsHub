module.exports = async (req, res) => {
  res.setHeader('Set-Cookie', `admin_session=; HttpOnly; Path=/; Max-Age=0`);
  res.json({ ok: true });
};
