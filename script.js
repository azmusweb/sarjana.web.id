const SPREADSHEET_ID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const API_KEY = "AIzaSyDKOClQy1z23Hwjr9HyHmzJbuaPE9Ccbv4";

const SHEET_CONFIG = "Config";
const SHEET_LIVE = "Live Website";

let config = {};
let posts = [];

async function fetchSpreadsheet() {
  // Ambil semua sheet Config dan Live Website
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}&includeGridData=true`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Gagal mengambil data spreadsheet");
  const data = await response.json();

  // Parse Config
  const configSheet = data.sheets.find(s => s.properties.title === SHEET_CONFIG);
  if (!configSheet) throw new Error("Sheet Config tidak ditemukan");
  configSheet.data[0].rowData.forEach(row => {
    if (row.values && row.values[0] && row.values[1]) {
      const key = row.values[0].formattedValue;
      const val = row.values[1].formattedValue || "";
      config[key] = val;
    }
  });

  // Parse Live Website (berita)
  const liveSheet = data.sheets.find(s => s.properties.title === SHEET_LIVE);
  if (!liveSheet) throw new Error("Sheet Live Website tidak ditemukan");
  const rows = liveSheet.data[0].rowData;
  posts = [];

  // Header rows biasanya di baris pertama, mulai dari baris kedua
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].values || [];
    posts.push({
      judul: row[0]?.formattedValue || "",
      label: row[1]?.formattedValue || "",
      gambar: row[2]?.formattedValue || "",
      isi: row[3]?.formattedValue || "",
      slug: row[4]?.formattedValue || "",
      meta_deskripsi: row[5]?.formattedValue || "",
      status_view: row[6]?.formattedValue || "",
      tanggal: row[7]?.formattedValue || "",
      type: row[8]?.formattedValue || ""
    });
  }
}

function setFavicon() {
  if (config["favicon-link"]) {
    const favicon = document.getElementById("favicon");
    favicon.href = config["favicon-link"];
  }
}

function renderLogo() {
  const logoDiv = document.getElementById("logo");
  if (config["link-logo-gambar-website"]) {
    logoDiv.innerHTML = `<a href="/"><img src="${config["link-logo-gambar-website"]}" alt="${config["judul website"] || "SARJANA"}" style="height:40px;"></a>`;
  } else if (config["logo-hanya-text"]) {
    logoDiv.innerHTML = `<a href="/" class="logo-text">${config["logo-hanya-text"]}</a>`;
  } else {
    logoDiv.innerHTML = `<a href="/" class="logo-text">SARJANA</a>`;
  }
}

function renderMenu() {
  const nav = document.getElementById("nav-menu");
  nav.innerHTML = "";
  if (!config["menu-navigasi"]) return;

  // menu-navigasi di config, pisah koma, sub menu dipisah pakai "|"
  const menus = config["menu-navigasi"].split(",");
  menus.forEach(item => {
    item = item.trim();
    if (!item) return;

    // cek sub menu
    if (item.includes("|")) {
      const [parent, ...subs] = item.split("|");
      const subItems = subs.join("|").split(";");
      const submenuHtml = subItems.map(s => {
        let text = s.trim();
        let slug = text.toLowerCase().replace(/\s+/g, "-");
        return `<a href="/${slug}">${text}</a>`;
      }).join("");
      nav.innerHTML += `
        <div class="dropdown">
          <span>${parent}</span>
          <div class="dropdown-content">${submenuHtml}</div>
        </div>
      `;
    } else {
      let slug = item.toLowerCase().replace(/\s+/g, "-");
      nav.innerHTML += `<a href="/${slug}">${item}</a>`;
    }
  });
}

function renderBreakingNews() {
  const breakingNewsDiv = document.getElementById("breaking-news");
  if (!posts.length) {
    breakingNewsDiv.innerHTML = "";
    return;
  }
  // Ambil 5 berita terbaru status_view="publish"
  const latest = posts.filter(p => p.status_view.toLowerCase() === "publish")
    .sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal))
    .slice(0,5);

  const text = latest.map(p => p.judul).join(" • ");
  breakingNewsDiv.innerHTML = `<span>${text}</span>`;
}

function renderSlider() {
  const slider = document.getElementById("slider");
  if (!posts.length) {
    slider.innerHTML = "";
    return;
  }
  const latest = posts.filter(p => p.status_view.toLowerCase() === "publish")
    .sort((a,b) => new
