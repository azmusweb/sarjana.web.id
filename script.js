const apiKey = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";
const sheetId = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const configSheet = "Config";
const contentSheet = "Live Website";

function fetchSheetData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
  return fetch(url).then(res => res.json()).then(data => {
    const [headers, ...rows] = data.values;
    return rows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] || ""])));
  });
}

function renderYear() {
  const year = new Date().getFullYear();
  document.getElementById("year").textContent = year;
}

function renderMenu(config) {
  const nav = document.getElementById("menu");
  if (!nav || !config.menu) return;
  const items = config.menu.split(",").map(item => {
    const [label, link] = item.split("|");
    return `<a href="${link}">${label}</a>`;
  });
  nav.innerHTML = items.join(" | ");
}

function renderLogo(config) {
  const logo = document.getElementById("logo");
  if (logo && config.logo) logo.innerHTML = `<img src="${config.logo}" alt="Logo" style="height:40px"/>`;
}

function loadHomepage() {
  fetchSheetData(configSheet).then(configRows => {
    const config = Object.fromEntries(configRows.map(row => [row.FUNGSI.toLowerCase(), row.WEBSITE]));
    renderYear();
    renderMenu(config);
    renderLogo(config);
  });
  fetchSheetData(contentSheet).then(data => {
    const container = document.getElementById("articles");
    if (container) {
      container.innerHTML = data
        .filter(b => b["Status View"] === "1")
        .map(b => `<article>
          <h2><a href="${location.origin}/${b.Slug}">${b.Judul}</a></h2>
          <img src="${b.Gambar}" alt="${b.Judul}" style="max-width:100%"/>
          <p>${b["Meta Deskripsi"]}</p>
        </article>`)
        .join("");
    }
  });
}

function loadBerita() {
  const slug = window.location.pathname.replace("/", "");
  fetchSheetData(contentSheet).then(data => {
    const artikel = data.find(b => b.Slug === slug);
    if (!artikel) return document.getElementById("beritaContent").textContent = "Berita tidak ditemukan.";
    document.title = artikel.Judul;
    document.getElementById("metaDesc").setAttribute("content", artikel["Meta Deskripsi"]);
    document.getElementById("beritaContent").innerHTML = `
      <h1>${artikel.Judul}</h1>
      <p><em>${artikel["Tgl/Jam"]}</em></p>
      <img src="${artikel.Gambar}" alt="${artikel.Judul}" style="max-width:100%"/>
      <div>${artikel.Body}</div>`;
  });
  loadHomepage();
}

document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname === "/" || location.pathname === "/index.html") {
    loadHomepage();
  } else {
    loadBerita();
  }
});
