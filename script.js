// === Konstanta Spreadsheet ===
const spreadsheetId = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const apiKey = "AIzaSyDKOClQy1z23Hwjr9HyHmzJbuaPE9Ccbv4";
const sheetConfig = "Config";
const sheetNews = "Live Website";
const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/`;

// === Fungsi Fetch Data ===
async function fetchSheet(sheetName) {
  const url = `${baseUrl}${sheetName}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.values;
}

// === Render Menu dari CONFIG ===
function renderMenu(menuItems) {
  const nav = document.getElementById("menu");
  nav.innerHTML = menuItems
    .map(
      (item) => `<a href="#" class="menu-link">${item}</a>`
    )
    .join(" ");
}

// === Render Headline Rolling ===
function renderHeadlineRolling(headlines) {
  const container = document.getElementById("headline-rolling");
  container.innerHTML =
    '<marquee>' +
    headlines.map((h) => `<span>${h}</span>`).join(" | ") +
    '</marquee>';
}

// === Render Footer ===
function renderFooter(text) {
  const footer = document.getElementById("footer-text");
  footer.textContent = text;
}

// === Render Widget ===
function renderWidget(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// === Render Daftar Berita ===
function renderNewsList(newsItems) {
  const container = document.getElementById("news-list");
  if (!container) return;
  container.innerHTML = newsItems
    .filter((row, i) => i > 0 && row[6] !== "nonaktif")
    .map(
      (row) => `
    <article class="news-card">
      <a href="berita.html?slug=${row[4]}">
        <img src="${row[2]}" alt="${row[0]}" />
        <h2>${row[0]}</h2>
        <p>${row[5]}</p>
      </a>
    </article>
  `
    )
    .join("");
}

// === Render Detail Berita ===
function renderNewsDetail(newsItems) {
  const container = document.getElementById("news-detail");
  if (!container) return;
  const slug = new URLSearchParams(window.location.search).get("slug");
  const berita = newsItems.find((row) => row[4] === slug);
  if (!berita) {
    container.innerHTML = "<p>Berita tidak ditemukan.</p>";
    return;
  }
  container.innerHTML = `
    <article>
      <h1>${berita[0]}</h1>
      <img src="${berita[2]}" alt="${berita[0]}" />
      <div>${berita[3]}</div>
      <small>${berita[7]}</small>
    </article>
  `;
}

// === Inisialisasi Website ===
async function initWebsite() {
  const [configData, newsData] = await Promise.all([
    fetchSheet(sheetConfig),
    fetchSheet(sheetNews),
  ]);

  const config = Object.fromEntries(
    configData.map(([key, value]) => [key.toLowerCase(), value])
  );

  if (config.logo) document.getElementById("logo").textContent = config.logo;
  if (config.menu) renderMenu(config.menu.split(","));
  if (config.headline) renderHeadlineRolling(config.headline.split(","));
  if (config.footer) renderFooter(config.footer);

  renderWidget("widget-left", config["widget kiri"] || "");
  renderWidget("widget-right", config["widget kanan"] || "");
  renderWidget("widget-blue-1", config["widget biru 1"] || "");
  renderWidget("widget-blue-2", config["widget biru 2"] || "");
  renderWidget("widget-blue-3", config["widget biru 3"] || "");

  if (document.getElementById("news-list")) renderNewsList(newsData);
  if (document.getElementById("news-detail")) renderNewsDetail(newsData);
}

initWebsite();
