const { getDb, signToken, cors } = require("./_lib");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { username, password } =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ username, password });

    if (!user)
      return res.status(401).json({ error: "Incorrect username or password" });

    const token = signToken({ username: user.username, role: user.role });
    return res
      .status(200)
      .json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message }); // shows real error
  }
};
