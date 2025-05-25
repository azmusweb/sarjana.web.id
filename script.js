const SPREADSHEET_ID = 'MASUKKAN_SPREADSHEET_ID_KAMU';
const API_KEY = 'MASUKKAN_API_KEY_KAMU';
const SHEET_CONFIG = 'CONFIG';
const SHEET_BERITA = 'Live Website';

// Utility: ambil parameter query dari URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fetch data spreadsheet
async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.values;
}

// Parse CONFIG jadi object key:value
function parseConfig(values) {
  const config = {};
  values.forEach(row => {
    if (row[0] && row[1]) {
      config[row[0].toLowerCase()] = row[1];
    }
  });
  return config;
}

// Render menu
function renderMenu(menuString) {
  const menuList = document.getElementById('menu');
  if (!menuList) return;
  // menuString contoh: "Home:/,Berita:/berita,Contact:/contact"
  const items = menuString.split(',');
  menuList.innerHTML = '';
  items.forEach(item => {
    const [label, url] = item.split(':');
    if (label && url) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url;
      a.textContent = label;
      li.appendChild(a);
      menuList.appendChild(li);
    }
  });
}

// Render slider placeholder (bisa dikembangkan sendiri)
function renderSlider() {
  const slider = document.getElementById('slider');
  if (!slider) return;
  slider.textContent = 'Slider Berita Unggulan (Bisa dikustomisasi)';
}

// Render berita utama (artikel pertama dengan status view=publish)
function renderMainArticle(articles) {
  const container = document.getElementById('main-article');
  if (!container) return;
  const main = articles.find(a => a.statusview?.toLowerCase() === 'publish') || articles[0];
  if (!main) {
    container.innerHTML = '<p>Berita utama tidak ditemukan.</p>';
    return;
  }
  container.innerHTML = `
    <img src="${main.gambar}" alt="${main.judul}" />
    <h2>${main.judul}</h2>
    <p>${main.isi.substring(0, 300)}...</p>
    <a href="berita.html?slug=${main.slug}" class="read-more">Baca selengkapnya</a>
  `;
}

// Render daftar berita lainnya (kecuali berita utama)
function renderNewsList(articles) {
  const container = document.getElementById('news-list');
  if (!container) return;
  const published = articles.filter(a => a.statusview?.toLowerCase() === 'publish');
  if (published.length === 0) {
    container.innerHTML = '<p>Tidak ada berita untuk ditampilkan.</p>';
    return;
  }
  // Lewati berita utama (index 0)
  const list = published.slice(1);

  container.innerHTML = '';
  list.forEach(article => {
    const div = document.createElement('div');
    div.classList.add('news-item');
    div.innerHTML = `
      <img src="${article.gambar}" alt="${article.judul}" />
      <div class="news-content">
        <h3>${article.judul}</h3>
        <p>${article.isi.substring(0, 100)}...</p>
        <a href="berita.html?slug=${article.slug}" class="read-more">Baca selengkapnya</a>
      </div>
    `;
    container.appendChild(div);
  });
}

// Render widget label unik
function renderWidgetLabel(articles) {
  const container = document.getElementById('labels-list');
  if (!container) return;
  const labels = new Set();
  articles.forEach(article => {
    if (article.label) {
      article.label.split(',').map(l => l.trim()).forEach(l => {
        if (l) labels.add(l);
      });
    }
  });
  container.innerHTML = '';
  Array.from(labels).sort().forEach(label => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `index.html?label=${encodeURIComponent(label)}`;
    a.textContent = label;
    li.appendChild(a);
    container.appendChild(li);
  });
}

// Render halaman beranda
async function renderHome() {
  const configValues = await fetchSheet(SHEET_CONFIG);
  const config = parseConfig(configValues);
  renderMenu(config.menu || 'Home:/');
  renderSlider();
  const newsValues = await fetchSheet(SHEET_BERITA);

  // Ambil header dan data
  const [header, ...rows] = newsValues;
  const articles = rows.map(row => {
    let obj = {};
    header.forEach((h, i) => {
      obj[h.toLowerCase()] = row[i] || '';
    });
    return obj;
  });

  // Jika ada filter label di URL, filter artikel
  const filterLabel = getQueryParam('label');
  let filteredArticles = articles;
  if (filterLabel) {
    filteredArticles = articles.filter(a =>
      a.label?.toLowerCase().split(',').map(l => l.trim()).includes(filterLabel.toLowerCase())
    );
  }

  renderMainArticle(filteredArticles);
  renderNewsList(filteredArticles);
  renderWidgetLabel(filteredArticles);
}

// Render halaman detail berita berdasarkan slug
async function renderDetail() {
  const configValues = await fetchSheet(SHEET_CONFIG);
  const config = parseConfig(configValues);
  renderMenu(config.menu || 'Home:/');
  
  const slug = getQueryParam('slug');
  if (!slug) {
    document.getElementById('detail-article').innerHTML = '<p>Slug berita tidak ditemukan di URL.</p>';
    return;
  }

  const newsValues = await fetchSheet(SHEET_BERITA);
  const [header, ...rows] = newsValues;
  const articles = rows.map(row => {
    let obj = {};
    header.forEach((h, i) => {
      obj[h.toLowerCase()] = row[i] || '';
    });
    return obj;
  });

  const article = articles.find(a => a.slug === slug);
  const container = document.getElementById('detail-article');
  if (!article) {
    container.innerHTML = '<p>Berita tidak ditemukan.</p>';
    return;
  }

  container.innerHTML = `
    <h1>${article.judul}</h1>
    <p><em>${article.tanggal}</em></p>
    <img src="${article.gambar}" alt="${article.judul}" />
    <article>${article.isi}</article>
    <p><a href="index.html">&laquo; Kembali ke Beranda</a></p>
  `;
}

// Inisialisasi halaman sesuai nama file
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.endsWith('berita.html')) {
    renderDetail();
  } else {
    renderHome();
  }
});
