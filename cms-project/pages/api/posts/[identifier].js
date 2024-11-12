import Post from "../model/post";

export default async function handler(req, res) {
  const { identifier } = req.query;
  try {
    // Assuming this is your existing route handler

    if (req.method === "GET") {
      const { page = 1, limit = 5 } = req.query; // Default to page 1, 5 posts per page
      let post;

      // Pagination: skip and limit based on the page and limit query params
      const offset = (page - 1) * limit;

      if (/^\d+$/.test(identifier)) {
        post = await Post.findOne({ where: { id: identifier } });
      } else {
        // Get paginated posts based on slug
        const posts = await Post.findAndCountAll({
          where: { slug: identifier },
          offset,
          limit: parseInt(limit, 10), // Ensure limit is an integer
        });

        // Return paginated results
        if (posts.count > 0) {
          res.status(200).json({
            posts: posts.rows,
            totalPosts: posts.count,
            totalPages: Math.ceil(posts.count / limit),
            currentPage: parseInt(page),
          });
        } else {
          res.status(404).json({ message: "Post not found" });
        }
      }
    } else if (req.method === "PUT") {
      try {
        const post = await Post.findOne({ where: { slug: identifier } });
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
        await post.update(req.body);
        res.status(200).json(post);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else if (req.method === "DELETE") {
      try {
        const post = await Post.findOne({ where: { slug: identifier } });
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
        await post.destroy();
        return res.status(200).send({ message: "Successfully deleted" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
