const apiKey = "AIzaSyDKOClQy1z23Hwjr9HyHmzJbuaPE9Ccbv4";
const sheetId = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const sheetConfig = "Config";
const sheetData = "Live Website";

let slug = "";
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("slug")) {
  // URL: berita.html?slug=...
  slug = urlParams.get("slug");
} else {
  // URL: /slug (tanpa .html)
  const path = window.location.pathname;
  if (path !== "/") {
    slug = path.substring(1); // hapus leading slash "/"
  }
}

// Ambil pengaturan dari Config
function loadConfig() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetConfig}?key=${apiKey}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const rows = data.values;
      const config = {};
      rows.forEach(([key, value]) => {
        config[key] = value;
      });

      // Terapkan ke tema
      document.documentElement.style.setProperty("--warna-utama", config["warna-utama"] || "#008000");
      document.documentElement.style.setProperty("--warna-text", config["warna-text"] || "#000");
      document.documentElement.style.setProperty("--warna-text-link", config["warna-text-link"] || "#008000");
      document.documentElement.style.setProperty("--warna-link-menu-navigasi", config["warna-link-menu-navigasi"] || "#fff");
      document.documentElement.style.setProperty("--warna-background-navigasi", config["warna-background-navigasi"] || "#008000");
      document.documentElement.style.setProperty("--warna-text-button", config["warna-text-button"] || "#fff");
      document.documentElement.style.setProperty("--warna-backround-button", config["warna-backround-button"] || "#008000");
      document.documentElement.style.setProperty("--warna-backround-body", config["warna-backround-body"] || "#fff");
      document.documentElement.style.setProperty("--warna-text-heading-h1-h2-h3", config["warna-text-heading-h1-h2-h3"] || "#000");
      document.documentElement.style.setProperty("--warna-text-heading-h4-h5-h6", config["warna-text-heading-h4-h5-h6"] || "#222");
      document.documentElement.style.setProperty("--warna-text-footer", config["warna-text-footer"] || "#eee");
      document.documentElement.style.setProperty("--warna-backround-footer", config["warna-backround-footer"] || "#111");

      // Logo
      if (config["link-logo-gambar-website"]) {
        const logo = document.querySelector(".logo-img");
        if (logo) logo.src = config["link-logo-gambar-website"];
      }
      if (config["favicon-link"]) {
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) favicon.href = config["favicon-link"];
      }
      if (config["meta-title-home"]) document.title = config["meta-title-home"];
      if (config["meta-deskripsi-home"]) {
        let desc = document.querySelector("meta[name='description']");
        if (!desc) {
          desc = document.createElement("meta");
          desc.name = "description";
          document.head.appendChild(desc);
        }
        desc.content = config["meta-deskripsi-home"];
      }

      // Navigasi
      if (config["menu-navigasi"]) {
        const menuContainer = document.querySelector("#menu-navigasi");
        if (menuContainer) {
          const menus = config["menu-navigasi"].split(",");
          menuContainer.innerHTML = menus
            .map((menu) => `<li><a href="/${menu.trim()}">${menu.trim()}</a></li>`)
            .join("");
        }
      }
    });
}

// Tampilkan daftar berita di halaman utama
function loadBeritaUtama() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetData}?key=${apiKey}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const rows = data.values.slice(1); // Hilangkan header
      const container = document.querySelector("#list-berita");
      if (!container) return;
      container.innerHTML = rows
        .filter((row) => row[6]?.toLowerCase() === "tampil")
        .map(
          (row) => `
        <article class="post">
          <img src="${row[2]}" alt="${row[0]}" loading="lazy">
          <h2><a href="/${row[4]}">${row[0]}</a></h2>
          <p>${row[5]}</p>
        </article>
      `
        )
        .join("");
    });
}

// Tampilkan detail berita di berita.html
function loadDetailBerita() {
  const slug = getSlug();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetData}?key=${apiKey}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const rows = data.values;
      const header = rows[0];
      const indexSlug = header.indexOf("Slug + PermaLink");
      const berita = rows.find((row, i) => i > 0 && row[indexSlug] === slug);
      if (!berita) {
        document.querySelector("#detail-berita").innerHTML = "<p>Berita tidak ditemukan.</p>";
        return;
      }

      const [judul, label, gambar, isi, , metaDeskripsi, , tanggal] = berita;

      document.querySelector("#detail-berita").innerHTML = `
        <h1>${judul}</h1>
        <p><em>${tanggal}</em></p>
        <img src="${gambar}" alt="${judul}">
        <div class="isi">${isi}</div>
      `;

      // Ganti title & meta
      document.title = judul;
      let meta = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = metaDeskripsi || judul;
    });
}

// Jalankan
document.addEventListener("DOMContentLoaded", () => {
  loadConfig();
  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    loadBeritaUtama();
  } else {
    loadDetailBerita();
  }
});
