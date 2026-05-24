import type { BlogPostListItem } from "@/lib/blog/types";
import BlogArticleCard from "./BlogArticleCard";

interface BlogRelatedPostsProps {
  posts: BlogPostListItem[];
}

export default function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-sans text-xl font-extrabold tracking-tight text-white md:text-2xl">
        Continuez votre lecture
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
