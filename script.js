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
  document.querySelector("link[rel='icon']").href = config["favicon-link"] || "favicon.png";

  if (document.getElementById("logoImg")) document.getElementById("logoImg").src = config["link-logo-gambar-website"] || "";
  if (document.getElementById("logoText")) document.getElementById("logoText").textContent = config["logo-hanya-text"] || "";
  if (document.getElementById("copyright")) document.getElementById("copyright").textContent = config["copyright-credit"] || "";

  // Set warna dari :root
  document.documentElement.style.setProperty("--bg", config["warna-backround-body"]);
  document.documentElement.style.setProperty("--text", config["warna-text"]);
  document.documentElement.style.setProperty("--bg-nav", config["warna-background-navigasi"]);
  document.documentElement.style.setProperty("--text-footer", config["warna-text-footer"]);

  // Menu Navigasi
  if (document.getElementById("mainMenu")) {
    const menus = config["menu-navigasi"].split(",").map(menu => `<a href="#">${menu.trim()}</a>`).join(" ");
    document.getElementById("mainMenu").innerHTML = menus;
  }
}

async function loadBreakingNews(dataArray) {
  const latest = dataArray.slice(1).filter(row => row[6].toLowerCase() === "show");
  if (document.getElementById("breakingText") && latest.length) {
    document.getElementById("breakingText").textContent = latest[0][0];
  }
}

async function init() {
  const config = await fetchSheet("Config");
  applyConfig(config);

  const berita = await fetchSheet("Live Website");
  loadBreakingNews(berita);
  // Tambahkan render slider, konten, widget, dst sesuai kebutuhan jika belum
}

window.addEventListener("DOMContentLoaded", init);
