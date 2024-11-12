import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/post.module.css"; // Adjust the path as needed

export default function PostDetail({ post }) {
  const router = useRouter();
  const postDetail = post.posts[0];

  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(postDetail);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/posts/${postDetail.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedPost),
    });

    if (res.ok) {
      setMessage("Post updated successfully!");
      setIsEditing(false);
    } else {
      setMessage("Failed to update the post");
    }
  };

  const handleDeletePost = async () => {
    const res = await fetch(`/api/posts/${postDetail.slug}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessage("Post deleted successfully!");
      router.push(`${process.env.base_url}/`);
    } else {
      setMessage("Failed to delete the post");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{postDetail.title}</h1>

      {isEditing ? (
        <form onSubmit={handleEditPost} className={styles.form}>
          <div>
            <label htmlFor="title" className={styles.label}>
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={editedPost.title}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className={styles.label}>
              Content:
            </label>
            <textarea
              id="content"
              name="content"
              value={editedPost.content}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <p>{postDetail.content}</p>
        </div>
      )}

      <div>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className={styles.button}
        >
          {isEditing ? "Cancel Edit" : "Edit Post"}
        </button>
        <button
          onClick={handleDeletePost}
          className={`${styles.button} ${styles.deleteButton}`}
        >
          Delete Post
        </button>
      </div>
    </div>
  );
}
console.log(process.env.BASE_URL);

export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.BASE_URL}/api/posts/${params.slug}`);
  const data = await res.json();

  return {
    props: { post: data },
  };
}
