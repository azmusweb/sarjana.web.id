const apiKey = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";
const sheetId = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";

async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  const [headers, ...rows] = data.values;
  return rows.map(row => Object.fromEntries(headers.map((h, i) => [h.trim(), row[i] || ""])));
}

function renderYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

async function renderConfig() {
  const config = await fetchSheet("Config").then(data =>
    Object.fromEntries(data.map(row => [row.FUNGSI.toLowerCase(), row.WEBSITE]))
  );
  document.getElementById("siteTitle").textContent = config.judul || "SARJANA";
  document.getElementById("siteDesc").setAttribute("content", config.deskripsi || "");
  document.getElementById("logo").innerHTML = `<img src="${config.logo}" alt="Logo" />`;

  const nav = document.getElementById("menu");
  if (config.menu) {
    const items = config.menu.split(",").map(item => {
      const [label, link] = item.split("|");
      return `<a href="${link.trim()}">${label.trim()}</a>`;
    });
    nav.innerHTML = items.join("");
  }
}

async function renderHomepage() {
  renderYear();
  await renderConfig();
  const berita = await fetchSheet("Live Website");
  const kontainer = document.getElementById("newsContainer");
  kontainer.innerHTML = berita.filter(b => b["Status View"] === "1").map(b => `
    <article>
      <h2><a href="/${b.Slug}">${b.Judul}</a></h2>
      <img src="${b.Gambar}" alt="${b.Judul}" />
      <p>${b["Meta Deskripsi"]}</p>
    </article>
  `).join("");
}

async function renderDetailPage() {
  const slug = window.location.pathname.replace("/", "");
  renderYear();
  await renderConfig();
  const berita = await fetchSheet("Live Website");
  const data = berita.find(b => b.Slug === slug);
  if (!data) {
    document.getElementById("beritaContent").innerHTML = "<h2>Berita tidak ditemukan.</h2>";
    return;
  }
  document.title = data.Judul;
  document.getElementById("metaDesc").setAttribute("content", data["Meta Deskripsi"]);
  document.getElementById("beritaContent").innerHTML = `
    <h1>${data.Judul}</h1>
    <p><em>${data["Tgl/Jam"]}</em></p>
    <img src="${data.Gambar}" alt="${data.Judul}" />
    <div>${data.Body}</div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path === "/" || path === "/index.html") renderHomepage();
  else renderDetailPage();
});
