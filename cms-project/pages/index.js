import { useState } from "react";
import styles from "../styles/HomePage.module.css";
import PostList from "../components/PostList";

export default function HomePage({ posts }) {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });
  const [message, setMessage] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // Handle form inputs for new post
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for adding a new post
  const handleAddPost = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    if (res.ok) {
      setMessage("Post added successfully!");
      setNewPost({
        title: "",
        content: "",
      });
      window.location.reload(); // Reload to show the new post
    } else {
      setMessage("Failed to add the post");
    }
  };

  // Calculate current posts to display
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div>
      <h1>Welcome to the CMS</h1>

      {/* Add Post Form */}
      <div className={styles["form-container"]}>
        <form onSubmit={handleAddPost}>
          <div>
            <input
              className={styles.input}
              type="text"
              id="title"
              name="title"
              placeholder="Any title you want to add?"
              value={newPost.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <textarea
              className={styles.textarea}
              id="content"
              name="content"
              placeholder="Add your content"
              value={newPost.content}
              onChange={handleChange}
              required
            />
          </div>

          <button className={styles.button} type="submit">
            Add Post
          </button>
        </form>

        {message && (
          <p
            className={`${styles.message} ${
              message.includes("Failed") ? styles.failed : ""
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <PostList posts={currentPosts} />

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Previous
        </button>
        <span className={styles.pageNumber}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${process.env.BASE_URL}/api/posts`);
  const posts = await res.json();
  return { props: { posts } };
}
