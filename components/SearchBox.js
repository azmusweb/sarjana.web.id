// components/SearchBox.js
import { useState } from 'react';

export default function SearchBox({ data }) {
  const [query, setQuery] = useState("");

  const filtered = data.filter(item =>
    item.Nama?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mt-6">
      <input
        type="text"
        placeholder="Cari nama kampus..."
        className="border px-3 py-2 w-full rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className="mt-4 space-y-4">
        {filtered.map((item, idx) => (
          <li key={idx} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{item.Nama}</h2>
            <p>{item.Alamat}</p>
            <a href={item.Website} className="text-blue-600" target="_blank" rel="noopener noreferrer">
              {item.Website}
            </a>
            <p className="text-sm text-gray-500">Akreditasi: {item.Akreditasi}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
