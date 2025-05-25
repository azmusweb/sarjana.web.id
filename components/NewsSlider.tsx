import Link from "next/link";

type Props = { posts: any[] };

export default function NewsSlider({ posts }: Props) {
  return (
    <div className="slider">
      {posts.slice(0, 5).map(post => (
        <div key={post.Slug} className="slide">
          <img src={post.Gambar} alt={post.Judul} />
          <div>
            <Link href={`/${post.Slug}`}><h3>{post.Judul}</h3></Link>
          </div>
        </div>
      ))}
      <style jsx>{`
        .slider { display: flex; overflow-x: auto; }
        .slide { min-width: 280px; margin-right: 16px; background: #fff; border-radius: 8px; }
        .slide img { width: 100%; max-height: 170px; border-radius: 8px 8px 0 0; object-fit: cover; }
        .slide h3 { font-size: 1.1rem; padding: 8px; }
      `}</style>
    </div>
  );
}