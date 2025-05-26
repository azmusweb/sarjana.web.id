const sheetID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const apiKey = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";
const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/`;

async function fetchSheet(sheetName) {
  const url = `${base}${sheetName}?alt=json&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  const rows = data.values;
  const headers = rows.shift();
  return rows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] || ""])));
}

function getSlug() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("slug");
}

async function renderIndex() {
  const listEl = document.getElementById("berita-list");
  const data = await fetchSheet("LIVE WEBSITE");
  listEl.innerHTML = "";
  data.forEach(item => {
    const el = document.createElement("div");
    el.className = "berita-item";
    el.innerHTML = `
      <h2><a href="berita.html?slug=${item.Slug}">${item.Judul}</a></h2>
      <p>${item.Tanggal} - ${item.Label}</p>
      <p>${item["Meta Deskripsi"]}</p>
    `;
    listEl.appendChild(el);
  });
}

async function renderDetail() {
  const slug = getSlug();
  const container = document.getElementById("berita-detail");
  const data = await fetchSheet("LIVE WEBSITE");
  const item = data.find(i => i.Slug === slug);
  if (!item) return container.innerHTML = "<p>Berita tidak ditemukan.</p>";
  container.innerHTML = `
    <h2>${item.Judul}</h2>
    <p><em>${item.Tanggal} - ${item.Label}</em></p>
    <img src="${item.Gambar}" alt="${item.Judul}" style="max-width:100%;margin:1rem 0"/>
    <div>${item.Body}</div>
  `;
}

if (document.getElementById("berita-list")) renderIndex();
if (document.getElementById("berita-detail")) renderDetail();
