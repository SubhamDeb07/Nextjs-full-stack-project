import Post from "../model/post";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const posts = await Post.findAll();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts", error });
    }
  } else if (req.method === "POST") {
    try {
      const { title, content } = req.body;
      const slug = title.toLowerCase().replace(/ /g, "-");
      const post = await Post.create({ title, slug, content });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
