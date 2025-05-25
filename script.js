const API_KEY = "AIzaSyDKOClQy1z23Hwjr9HyHmzJbuaPE9Ccbv4";
const SHEET_ID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";

async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.values;
}

function applyConfig(configArray) {
  const config = Object.fromEntries(configArray.slice(1));
  document.title = config["meta-title-home"] || "SARJANA";
  document.querySelector("link[rel='icon']").href = config["favicon-link"] || "";
  if (document.getElementById("logoImg")) document.getElementById("logoImg").src = config["link-logo-gambar-website"] || "";
  if (document.getElementById("logoText")) document.getElementById("logoText").textContent = config["logo-hanya-text"] || "";
  if (document.getElementById("copyright")) document.getElementById("copyright").textContent = config["copyright-credit"] || "";

  // Warna CSS
  document.documentElement.style.setProperty("--bg", config["warna-backround-body"]);
  document.documentElement.style.setProperty("--text", config["warna-text"]);
  document.documentElement.style.setProperty("--bg-nav", config["warna-background-navigasi"]);
  document.documentElement.style.setProperty("--text-footer", config["warna-text-footer"]);
}

async function init() {
  const config = await fetchSheet("Config");
  applyConfig(config);

  // Tambahkan logika isi konten lainnya di sini…
}

window.addEventListener("DOMContentLoaded", init);
