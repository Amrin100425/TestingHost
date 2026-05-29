// api/articles.js  — GET (by page_slug) | POST (add) | PUT (edit) | DELETE
const { getDb, verifyToken, cors } = require('./_lib');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  // GET /api/articles?page=about  — public
  if (req.method === 'GET') {
    const slug = req.query.page || 'home';
    const [rows] = await db.query(
      'SELECT id, title, content, created_at FROM articles WHERE page_slug = ? ORDER BY id ASC',
      [slug]
    );
    return res.status(200).json(rows);
  }

  // All write operations require admin
  const user = verifyToken(req);
  if (!user || user.role !== 'admin')
    return res.status(403).json({ error: 'Admin only' });

  // POST — create article
  if (req.method === 'POST') {
    const { title, content, page_slug } = req.body;
    if (!title || !page_slug) return res.status(400).json({ error: 'title and page_slug required' });

    const [result] = await db.query(
      'INSERT INTO articles (title, content, page_slug, created_at) VALUES (?, ?, ?, NOW())',
      [title, content || '', page_slug]
    );
    return res.status(201).json({ id: result.insertId, title, page_slug });
  }

  // PUT — edit article
  if (req.method === 'PUT') {
    const { id, title, content } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });

    await db.query('UPDATE articles SET title = ?, content = ? WHERE id = ?', [title, content, id]);
    return res.status(200).json({ success: true });
  }

  // DELETE — delete article
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });

    await db.query('DELETE FROM articles WHERE id = ?', [id]);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
