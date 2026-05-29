const { getDb, verifyToken, cors } = require("./_lib");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const db = await getDb();
  const articles = db.collection("articles");

  // GET /api/articles?page=about — public
  if (req.method === "GET") {
    try {
      const slug = req.query.page || "home";
      const rows = await articles
        .find(
          { page_slug: slug },
          { projection: { title: 1, content: 1, created_at: 1 } },
        )
        .sort({ _id: 1 })
        .toArray();
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // All write operations require admin
  const user = verifyToken(req);
  if (!user || user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });

  // POST — create article
  if (req.method === "POST") {
    try {
      const { title, content, page_slug } = req.body || {};
      if (!title || !page_slug)
        return res.status(400).json({ error: "title and page_slug required" });

      const result = await articles.insertOne({
        title,
        content: content || "",
        page_slug,
        created_at: new Date(),
      });
      return res.status(201).json({ id: result.insertedId, title, page_slug });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // PUT — edit article
  if (req.method === "PUT") {
    try {
      const { id, title, content } = req.body || {};
      if (!id) return res.status(400).json({ error: "id required" });

      const { ObjectId } = require("mongodb");
      await articles.updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, content } },
      );
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // DELETE — delete article
  if (req.method === "DELETE") {
    try {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: "id required" });

      const { ObjectId } = require("mongodb");
      await articles.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
