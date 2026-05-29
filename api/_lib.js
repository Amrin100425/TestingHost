// api/_lib.js  — shared DB connection and JWT helpers
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-vercel-env';

// ── Database ──────────────────────────────────────────────────────────────────
let pool;
function getDb() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl:      { rejectUnauthorized: true },   // PlanetScale requires SSL
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

// ── JWT helpers ───────────────────────────────────────────────────────────────
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
}

// ── CORS headers (allows your Vercel frontend domain) ─────────────────────────
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = { getDb, signToken, verifyToken, cors };
