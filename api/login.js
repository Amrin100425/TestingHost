const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    // Parse body safely
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { username, password } = body;

    if (!username || !password)
      return res.status(400).json({ error: "Username and password required" });

    // Connect to MongoDB directly
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("cms");

    const user = await db.collection("users").findOne({ username, password });
    await client.close();

    if (!user)
      return res.status(401).json({ error: "Incorrect username or password" });

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET || "change-me",
      { expiresIn: "8h" },
    );

    return res
      .status(200)
      .json({ token, username: user.username, role: user.role });
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
};
