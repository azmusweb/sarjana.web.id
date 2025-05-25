const SHEET_ID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const API_KEY = "AIzaSyDKOClQy1z23Hwjr9HyHmzJbuaPE9Ccbv4";

async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.values) return [];
  const [header, ...rows] = data.values;
  return rows.map(row =>
    Object.fromEntries(header.map((k, i) => [k, row[i] || ""]))
  );
}

export async function getConfig() {
  const arr = await fetchSheet('CONFIG');
  return Object.fromEntries(arr.map(item => [item.FUNGSI, item.WEBSITE]));
}

export async function getPosts({ status = "yes", limit = 10 } = {}) {
  const posts = await fetchSheet('LIVE WEBSITE');
  return posts
    .filter(p => (status ? (p["Status View"] || '').toLowerCase() === status : true))
    .slice(0, limit);
}

export async function getPostBySlug(slug) {
  const posts = await fetchSheet('LIVE WEBSITE');
  return posts.find(p => p.Slug === slug);
}

export async function getPopularPosts(limit = 5) {
  const posts = await fetchSheet('LIVE WEBSITE');
  // Anggap berita populer adalah yang paling banyak dilihat (sort by Tgl/Jam terbaru, misal)
  return posts
    .filter(p => (p["Status View"] || '').toLowerCase() === "yes")
    .sort((a, b) => new Date(b["Tgl/Jam"]) - new Date(a["Tgl/Jam"]))
    .slice(0, limit);
}

export async function getLabels() {
  const posts = await fetchSheet('LIVE WEBSITE');
  const labels = new Set();
  posts.forEach(p => p.Label && p.Label.split(",").forEach(l => labels.add(l.trim())));
  return Array.from(labels);
}