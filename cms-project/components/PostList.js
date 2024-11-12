// components/PostList.js
import Link from "next/link";

export default function PostList({ posts }) {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.slug}>
          <h2>
            <Link href={`/post/${post.slug}`}>{post.title}</Link>
          </h2>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
