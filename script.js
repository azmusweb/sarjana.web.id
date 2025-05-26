async function fetchSheetData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.sheetId}/values/${sheetName}?key=${CONFIG.apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.values;
}

function renderMenu(menuRow) {
  const menuEl = document.getElementById("main-menu");
  if (!menuEl) return;
  const menus = menuRow[0].split(",").map(m => m.trim());
  menuEl.innerHTML = menus.map(m => `<a href="?label=${encodeURIComponent(m)}">${m}</a>`).join("");
}

function renderBeritaList(data) {
  const container = document.getElementById("berita-container");
  if (!container) return;
  const headers = data[0];
  const rows = data.slice(1);
  container.innerHTML = rows.map(row => {
    const slug = row[4];
    const title = row[0];
    const label = row[1];
    const image = row[2];
    return \`
      <article>
        <a href="berita.html?slug=\${slug}">
          <h2>\${title}</h2>
          <img src="\${image}" alt="\${title}" width="100%" />
          <p><strong>\${label}</strong></p>
        </a>
      </article>
    \`;
  }).join("");
}

function renderBeritaDetail(data, slug) {
  const detailEl = document.getElementById("berita-detail");
  if (!detailEl) return;
  const headers = data[0];
  const rows = data.slice(1);
  const berita = rows.find(row => row[4] === slug);
  if (!berita) {
    detailEl.innerHTML = "<p>Berita tidak ditemukan.</p>";
    return;
  }
  detailEl.innerHTML = \`
    <h2>\${berita[0]}</h2>
    <img src="\${berita[2]}" alt="\${berita[0]}" width="100%" />
    <p><em>\${berita[1]}</em></p>
    <div>\${berita[3]}</div>
  \`;
}

function getSlug() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("slug");
}

async function init() {
  const config = await fetchSheetData(CONFIG.configSheet);
  renderMenu(config);

  if (document.getElementById("berita-container")) {
    const berita = await fetchSheetData(CONFIG.contentSheet);
    renderBeritaList(berita);
  }

  if (document.getElementById("berita-detail")) {
    const berita = await fetchSheetData(CONFIG.contentSheet);
    const slug = getSlug();
    renderBeritaDetail(berita, slug);
  }
}

document.addEventListener("DOMContentLoaded", init);
