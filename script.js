const sheetID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const apiKey = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";

async function fetchSheetData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  const rows = data.values;
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i] || "");
    return obj;
  });
}

async function renderConfig() {
  const config = await fetchSheetData("Config");
  const configMap = {};
  config.forEach(item => configMap[item["FUNGSI"]] = item["WEBSITE"]);
  document.documentElement.style.setProperty("--warna-utama", configMap["WARNA_UTAMA"]);
  if (configMap["LOGO"]) document.getElementById("logo-img").src = configMap["LOGO"];
  if (configMap["MENU"]) {
    const menuContainer = document.getElementById("nav-menu");
    menuContainer.innerHTML = "";
    configMap["MENU"].split(",").forEach(menu => {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = menu.trim();
      menuContainer.appendChild(link);
    });
  }
}

async function renderBeritaUtama() {
  const berita = await fetchSheetData("Live Website");
  const container = document.getElementById("berita-container");
  container.innerHTML = "";
  berita.filter(item => item["Status View"] === "aktif").forEach(item => {
    const div = document.createElement("div");
    div.className = "berita-box";
    div.innerHTML = `
      <img src="${item["Gambar"]}" alt="${item["Judul"]}">
      <h2><a href="berita.html?slug=${item["Slug + PermaLink"]}">${item["Judul"]}</a></h2>
      <p>${item["Meta Deskripsi"]}</p>
    `;
    container.appendChild(div);
  });
}

async function renderDetailBerita() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");
  if (!slug) return;
  const berita = await fetchSheetData("Live Website");
  const item = berita.find(b => b["Slug + PermaLink"] === slug);
  if (!item) return;
  document.getElementById("judul-berita").textContent = item["Judul"];
  document.getElementById("gambar-berita").src = item["Gambar"];
  document.getElementById("body-berita").innerHTML = item["Body"];
  document.title = item["Judul"];
}

// Fungsi login sederhana
async function loginUser(email, password) {
  const users = await fetchSheetData("Users");
  const user = users.find(u => u["Email"] === email && u["Password"] === password);
  if (user) {
    localStorage.setItem("sarjana_user", JSON.stringify(user));
    return true;
  }
  return false;
}

function logoutUser() {
  localStorage.removeItem("sarjana_user");
  location.href = "login.html";
}

function getLoggedInUser() {
  const user = localStorage.getItem("sarjana_user");
  return user ? JSON.parse(user) : null;
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("logo-img")) renderConfig();
  if (document.getElementById("berita-container")) renderBeritaUtama();
  if (document.getElementById("judul-berita")) renderDetailBerita();
});
