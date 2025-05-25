import axios from "axios";

const SPREADSHEET_ID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyDKOClQy1z23Hwjr9HyHmzJbuaPE9Ccbv4";
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/`;

export async function fetchSheet(sheetName: string) {
  const url = `${BASE_URL}${sheetName}?key=${API_KEY}`;
  const { data } = await axios.get(url);
  if (!data.values) return [];
  const [header, ...rows] = data.values;
  return rows.map((row: string[]) =>
    Object.fromEntries(header.map((h: string, i: number) => [h, row[i] || ""]))
  );
}

export async function getConfig() {
  const configRows = await fetchSheet("CONFIG");
  const config: Record<string, string> = {};
  configRows.forEach(row => {
    config[row.FUNGSI] = row.WEBSITE;
  });
  return config;
}

export async function getLivePosts() {
  const posts = await fetchSheet("LIVE WEBSITE");
  return posts.filter(p => (p["Status View"] || "").toLowerCase() === "yes");
}

export async function getPostBySlug(slug: string) {
  const posts = await getLivePosts();
  return posts.find(p => p.Slug === slug);
}