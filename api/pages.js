// api/pages.js  — GET (list) | POST (add) | PUT (edit) | DELETE
const fs   = require('fs');
const path = require('path');
const { verifyToken, cors } = require('./_lib');

const PAGES_FILE = path.join('/tmp', 'pages.json');
const SEED_FILE  = path.join(process.cwd(), 'public', 'data', 'pages.json');

function loadPages() {
  // Try writable /tmp copy first, fall back to bundled seed
  if (fs.existsSync(PAGES_FILE)) {
    return JSON.parse(fs.readFileSync(PAGES_FILE, 'utf8'));
  }
  if (fs.existsSync(SEED_FILE)) {
    const pages = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
    return pages;
  }
  return [];
}

function savePages(pages) {
  fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — public, no auth needed
  if (req.method === 'GET') {
    return res.status(200).json(loadPages());
  }

  // All other methods require admin
  const user = verifyToken(req);
  if (!user || user.role !== 'admin')
    return res.status(403).json({ error: 'Admin only' });

  const pages = loadPages();

  // POST — add new page
  if (req.method === 'POST') {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const exists = pages.some(p => p.slug === slug);
    if (exists) return res.status(409).json({ error: 'Page already exists' });

    pages.push({ title, slug });
    savePages(pages);
    return res.status(201).json({ title, slug });
  }

  // PUT — rename page
  if (req.method === 'PUT') {
    const { index, title } = req.body;
    if (title === undefined || index === undefined)
      return res.status(400).json({ error: 'index and title required' });

    const newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    pages[index] = { title, slug: newSlug };
    savePages(pages);
    return res.status(200).json(pages[index]);
  }

  // DELETE — remove page
  if (req.method === 'DELETE') {
    const { index } = req.body;
    if (index === undefined) return res.status(400).json({ error: 'index required' });
    if (pages[index]?.slug === 'home')
      return res.status(403).json({ error: 'Cannot delete home page' });

    pages.splice(index, 1);
    savePages(pages);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
