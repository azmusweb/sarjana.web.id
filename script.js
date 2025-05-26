const SPREADSHEET_ID = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const API_KEY = 'AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs';

let configData = {};
let liveWebsiteData = [];

// Ambil data sheet Google Spreadsheet
async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.values) return [];
  return data.values;
}

// Parse data config jadi objek key-value
function parseConfig(rawConfig) {
  const config = {};
  rawConfig.forEach(([key, value]) => {
    config[key.trim()] = value ? value.trim() : '';
  });
  return config;
}

// Parsing menu navigasi dari config
function buildMenu(menuNav) {
  // Format: "Home | /, BERITA (news|red) | /berita/, GURU | /guru/, ..."
  const items = menuNav.split(',').map(item => item.trim()).filter(Boolean);
  const menuItems = items.map(item => {
    const parts = item.split('|').map(p => p.trim());
    let titlePart = parts[0];
    const url = parts[1] || '#';

    let title = titlePart;
    let label = null;
    let color = null;
    const labelMatch = titlePart.match(/\(([^)]+)\)/);
    if (labelMatch) {
      const inside = labelMatch[1].split('|');
      label = inside[0].trim();
      color = inside[1] ? inside[1].trim() : null;
      title = titlePart.replace(/\(([^)]+)\)/, '').trim();
    }
    return { title, label, color, url };
  });
  return menuItems;
}

// Render menu ke header nav
function renderMenu(menuItems) {
  const nav = document.getElementById('menu');
  nav.innerHTML = '';
  menuItems.forEach(item => {
    const a = document.createElement('a');
    // Hilangkan www dan .html sesuai permintaan
    let href = item.url.replace(/\.html$/i, '');
    href = href.replace(/^www\./i, '');
    a.href = href;
    a.textContent = item.title;
    if (item.color) {
      a.style.color = item.color;
      a.style.fontWeight = '700';
    }
    nav.appendChild(a);
  });
}

// Render logo situs
function renderLogo(siteName, siteLogo) {
  const logo = document.getElementById('logo');
  if (siteLogo) {
    const img = document.createElement('img');
    img.src = siteLogo;
    img.alt = siteName;
    img.style.height = '40px';
    img.style.verticalAlign = 'middle';
    logo.innerHTML = '';
    logo.appendChild(img);
  } else {
    logo.textContent = siteName;
  }
  logo.href = '/';
}

// Filter data berita berdasarkan label dan status aktif
function filterByLabel(label) {
  return liveWebsiteData.filter(item => 
    item.Label.toLowerCase() === label.toLowerCase() && 
    item.Status_View.toLowerCase() === 'active'
  );
}

// Membuat elemen artikel berita singkat
function createArticle(item) {
  const article = document.createElement('article');
  article.className = 'news-item';
  article.innerHTML = `
    <h3><a href="/${item.Slug}">${item.Judul}</a></h3>
    <p>${item.Meta_Deskripsi}</p>
  `;
  return article;
}

// Render widget berdasarkan label widget di config
function renderWidget(id, label) {
  const container = document.getElementById(id);
  container.innerHTML = '';
  if (!label) return;
  const items = filterByLabel(label);
  if (items.length === 0) {
    container.textContent = `Tidak ada berita untuk kategori ${label}`;
    return;
  }
  items.slice(0, 5).forEach(item => {
    const art = createArticle(item);
    container.appendChild(art);
  });
}

// Render rolling headline jika diaktifkan
function renderHeadlineRolling() {
  if (configData.HEADLINE_ROLLING?.toLowerCase() !== 'true') return;
  const container = document.getElementById('headline-rolling');
  const headlines = liveWebsiteData.filter(item => 
    item.Label.toLowerCase() === configData.HEADLINE_LABEL?.toLowerCase() && 
    item.Status_View.toLowerCase() === 'active'
  );
  if (headlines.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.textContent = headlines.map(h => h.Judul).join('  •  ');
  // Simple marquee effect (scroll)
  let pos = container.offsetWidth;
  function scroll() {
    pos--;
    if (pos < -container.scrollWidth) pos = container.offsetWidth;
    container.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(scroll);
  }
  scroll();
}

// Render halaman utama index.html
function renderIndex() {
  renderLogo(configData.SITE_NAME, configData.SITE_LOGO);
  renderMenu(buildMenu(configData['menu-navigasi'] || ''));

  // Render widgets kiri dan kanan sesuai config
  renderWidget('widget-left', configData.WIDGET_LABEL_1);
  renderWidget('widget-right', configData.WIDGET_LABEL_2);
  
  // Render blue widgets jika ada
  renderWidget('widget-blue-1', configData.WIDGET_LABEL_1);
  renderWidget('widget-blue-2', configData.WIDGET_LABEL_2);
  renderWidget('widget-blue-3', configData.WIDGET_LABEL_3);

  renderHeadlineRolling();
}

// Render halaman detail berita di berita.html
function renderDetail(slug) {
  renderLogo(configData.SITE_NAME, configData.SITE_LOGO);
  renderMenu(buildMenu(configData['menu-navigasi'] || ''));

  const articleContainer = document.getElementById('news-detail');
  const news = liveWebsiteData.find(item => item.Slug.toLowerCase() === slug.toLowerCase());
  if (!news) {
    articleContainer.innerHTML = '<p>Berita tidak ditemukan.</p>';
    return;
  }
  articleContainer.innerHTML = `
    <h1>${news.Judul}</h1>
    ${news.Gambar ? `<img src="${news.Gambar}" alt="${news.Judul}" />` : ''}
    <p>${news.Body}</p>
  `;
}

// Ambil slug dari URL tanpa ekstensi
function getSlugFromURL() {
  const path = window.location.pathname;
  const cleanPath = path.replace(/^\/|\/$/g, ''); // hapus slash depan belakang
  return cleanPath.toLowerCase();
}

// Inisialisasi website
async function init() {
  const rawConfig = await fetchSheet('Config');
  configData = parseConfig(rawConfig);

  const rawLiveWebsite = await fetchSheet('Live Website');
  // Asumsikan header kolom di baris pertama
  const headers = rawLiveWebsite[0];
  liveWebsiteData = rawLiveWebsite.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || '';
    });
    return obj;
  });

  const slug = getSlugFromURL();

  if (window.location.pathname.endsWith('berita') || slug === 'berita') {
    // jika url /berita/ render halaman berita list (index.html bisa saja)
    renderIndex();
  } else if (window.location.pathname === '/' || slug === '') {
    renderIndex();
  } else {
    // selain itu render detail berita
    renderDetail(slug);
  }

  // Footer text
  const footer = document.getElementById('footer-text');
  if (footer && configData.FOOTER_TEXT) {
    footer.textContent = configData.FOOTER_TEXT;
  }
}

// Jalankan inisialisasi saat halaman siap
window.addEventListener('DOMContentLoaded', init);
