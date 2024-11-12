const post = require("../controllers/post");

const express = require("express");
const router = express.Router();

router.post("/", post.createPost);
router.get("/", post.getPosts);
router.get("/:id", post.getPostById);
router.put("/update/:id", post.updatePost);
router.delete("/deletePost/:id", post.deletePost);

module.exports = router;
