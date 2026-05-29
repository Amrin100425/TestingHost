// api/login.js
const { getDb, signToken, cors } = require('./_lib');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  try {
    const db = getDb();
    const [rows] = await db.query(
      'SELECT username, password, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: 'Incorrect username or password' });

    const user = rows[0];
    const token = signToken({ username: user.username, role: user.role });
    return res.status(200).json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
