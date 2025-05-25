const SHEET_ID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const API_KEY = "AIzaSyDKOClQy1z23Hwjr9HyHmzJbuaPE9Ccbv4";

async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const [header, ...rows] = data.values;
  return rows.map(row =>
    Object.fromEntries(header.map((k, i) => [k, row[i] || ""]))
  );
}

export async function getConfig() {
  const configArr = await fetchSheet('CONFIG');
  return Object.fromEntries(configArr.map(item => [item.FUNGSI, item.WEBSITE]));
}

export async function getPosts({ status = "yes", limit = 10 } = {}) {
  const posts = await fetchSheet('LIVE WEBSITE');
  return posts
    .filter(p => (status ? p["Status View"].toLowerCase() === status : true))
    .slice(0, limit);
}

export async function getPostBySlug(slug) {
  const posts = await fetchSheet('LIVE WEBSITE');
  return posts.find(p => p.Slug === slug);
}

export async function getLabels() {
  const posts = await fetchSheet('LIVE WEBSITE');
  return [...new Set(posts.flatMap(p => p.Label.split(",").map(l => l.trim())))];
}

// Tambah fungsi lain sesuai kebutuhan