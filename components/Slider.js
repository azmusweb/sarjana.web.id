export default function Slider({ posts }) {
  return (
    <div className="w-full overflow-x-auto whitespace-nowrap py-2 bg-gray-100">
      {posts.map(post => (
        <a
          key={post.Slug}
          href={`/${post.Slug}`}
          className="inline-block w-64 mx-2 bg-white shadow rounded overflow-hidden"
        >
          {post.Gambar && (
            <img src={post.Gambar} alt={post.Judul} className="h-32 w-full object-cover" />
          )}
          <div className="p-2">
            <div className="font-bold text-lg">{post.Judul}</div>
          </div>
        </a>
      ))}
    </div>
  );
}