import { useEffect, useState } from "react";

export default function Widget({ title, posts = [], type = "", limit = 10 }) {
  const [labels, setLabels] = useState([]);
  useEffect(() => {
    if (type === "label") {
      fetch("/api/labels")
        .then(res => res.json())
        .then(data => setLabels(data.slice(0, limit)));
    }
  }, [type, limit]);

  if (type === "label")
    return (
      <div className="mb-4">
        <h2 className="font-bold text-lg mb-2">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {labels.map(label => (
            <span key={label} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{label}</span>
          ))}
        </div>
      </div>
    );

  return (
    <div className="mb-4">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <ul>
        {posts.map(post => (
          <li key={post.Slug}>
            <a href={`/${post.Slug}`} className="hover:underline">{post.Judul}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}