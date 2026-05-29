// api/upload.js  — TinyMCE image upload handler
// NOTE: Vercel filesystem is ephemeral. Files survive the current request only.
// Replace with Cloudinary when ready for production persistence.
const fs      = require('fs');
const path    = require('path');
const { verifyToken, cors } = require('./_lib');

// Vercel doesn't support multipart natively — use a raw body + base64 approach
// TinyMCE sends multipart/form-data; we use the `formidable` parser
const formidable = require('formidable');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = verifyToken(req);
  if (!user || user.role !== 'admin')
    return res.status(403).json({ error: 'Admin only' });

  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const uploadDir = '/tmp/uploads';
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({ uploadDir, keepExtensions: true, maxFileSize: 5 * 1024 * 1024 });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });

    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: 'No file received' });

    const filename = Date.now() + '_' + (file.originalFilename || 'upload');
    const dest = path.join(uploadDir, filename);
    fs.renameSync(file.filepath, dest);

    // Return TinyMCE-compatible location
    return res.status(200).json({ location: `/api/uploads/${filename}` });
  });
};
