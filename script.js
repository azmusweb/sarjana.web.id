const SPREADSHEET_ID = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const API_KEY = 'AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs';

let configData = {};
let beritaData = [];

// Utility ambil data JSON dari Google Sheets via API
async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.values;
}

// Parsing data konfigurasi ke objek kunci-nilai
function parseConfig(values) {
  let config = {};
  values.forEach(row => {
    if (row.length >= 2) {
      config[row[0].trim()] = row[1].trim();
    }
  });
  return config;
}

// Parsing data berita dari sheet 'Live Website'
function parseBerita(values) {
  const headers = values[0];
  let berita = [];
  for (let i = 1; i < values.length; i++) {
    let obj = {};
    headers.forEach((h, idx) => {
      obj[h.trim()] = values[i][idx] || '';
    });
    berita.push(obj);
  }
  return berita;
}

// Render logo & judul situs
function renderLogoAndSiteName() {
  const logoUrl = configData.SITE_LOGO || '';
  const siteName = configData.SITE_NAME || 'Website';
  const logoImg = document.getElementById('site-logo');
  const siteNameEl = document.getElementById('site-name');
  const logoLink = document.getElementById('logo-link');

  if (logoUrl !== '') {
    logoImg.src = logoUrl;
    logoImg.style.display = 'inline-block';
    siteNameEl.style.display = 'none';
  } else {
    siteNameEl.textContent = siteName;
    siteNameEl.style.display = 'inline-block';
    logoImg.style.display = 'none';
  }

  logoLink.href = '/';
}

// Render menu & submenu dari config['menu-navigasi']
function renderMenu() {
  const menuContainer = document.getElementById('menu-container');
  menuContainer.innerHTML = '';
  const menuStr = configData['menu-navigasi'] || '';
  if (!menuStr) return;

  const menuItems = menuStr.split(',');
  menuItems.forEach(item => {
    item = item.trim();
    if (!item) return;

    // Contoh item: Home | / atau BERITA (news|red) | /berita/
    // Parse judul & submenu
    let parts = item.split('|').map(p => p.trim());
    let titlePart = parts[0];
    let url = parts[1] || '#';

    // Cek submenu di dalam kurung ()
    let submenu = [];
    let submenuMatch = titlePart.match(/\(([^)]+)\)/);
    if (submenuMatch) {
      submenu = submenuMatch[1].split('|').map(s => s.trim());
      titlePart = titlePart.replace(/\(([^)]+)\)/, '').trim();
    }

    // Buat elemen li
    const li = document.createElement('li');
    li.classList.add('menu-item');
    if (submenu.length) li.classList.add('has-submenu');

    // Buat link utama menu
    const a = document.createElement('a');
    a.href = url;
    a.textContent = titlePart;
    li.appendChild(a);

    // Buat submenu jika ada
    if (submenu.length) {
      const ulSub = document.createElement('ul');
      ulSub.classList.add('submenu');
      submenu.forEach(sub => {
        const liSub = document.createElement('li');
        const aSub = document.createElement('a');
        aSub.href = url.endsWith('/') ? url + sub + '/' : url + '/' + sub + '/';
        aSub.textContent = sub;
        liSub.appendChild(aSub);
        ulSub.appendChild(liSub);
      });
      li.appendChild(ulSub);
    }

    menuContainer.appendChild(li);
  });
}

// Render bilah berita utama (rolling headline) berdasarkan label HEADLINE_LABEL
function renderHeadline() {
  if (!configData.HEADLINE_ROLLING || configData.HEADLINE_ROLLING.toLowerCase() !== 'true') return;

  const label = configData.HEADLINE_LABEL || 'headline';
  const headlineContainer = document.getElementById('headline-container');
  headlineContainer.innerHTML = '';

  const headlines = beritaData.filter(b => b.Label.toLowerCase() === label.toLowerCase() && b.Status_View.toLowerCase() === 'publish');
  if (headlines.length === 0) return;

  // Buat teks berjalan marquee sederhana
  let marquee = document.createElement('marquee');
  marquee.setAttribute('behavior', 'scroll');
  marquee.setAttribute('direction', 'left');
  marquee.setAttribute('scrollamount', '5');

  headlines.forEach((item, idx) => {
    const a = document.createElement('a');
    a.href = item.Slug.startsWith('/') ? item.Slug : '/' + item.Slug;
    a.textContent = item.Judul;
    a.style.marginRight = '50px';
    marquee.appendChild(a);
  });

  headlineContainer.appendChild(marquee);
}

// Render widget sesuai label di config dan data berita
function renderWidgets() {
  // Widget kiri dan kanan
  ['LEFT', 'RIGHT'].forEach(side => {
    const container = document.getElementById(`widget-${side.toLowerCase()}`);
    if (!container) return;
    container.innerHTML = '';
    const widgets = (configData[`WIDGET_${side}`] || '').split(',').map(w => w.trim()).filter(Boolean);

    widgets.forEach(widgetLabel => {
      const items = beritaData.filter(b => b.Label.toLowerCase() === widgetLabel.toLowerCase() && b.Status_View.toLowerCase() === 'publish');
      if (items.length === 0) return;

      // Buat section widget
      const section = document.createElement('section');
      section.classList.add('widget-section');
      const h3 = document.createElement('h3');
      h3.textContent = widgetLabel.toUpperCase();
      section.appendChild(h3);

      items.slice(0, 3).forEach(item => {
        const a = document.createElement('a');
        a.href = item.Slug.startsWith('/') ? item.Slug : '/' + item.Slug;
        a.textContent = item.Judul;
        section.appendChild(a);
        section.appendChild(document.createElement('br'));
      });

      container.appendChild(section);
    });
  });

  // Widget biru bawah (3 bilah)
  for (let i = 1; i <= 3; i++) {
    const container = document.getElementById(`widget-blue-${i}`);
    if (!container) continue;
    container.innerHTML = '';

    const label = configData[`WIDGET_LABEL_${i}`] || '';
    if (!label) continue;

    const items = beritaData.filter(b => b.Label.toLowerCase() === label.toLowerCase() && b.Status_View.toLowerCase() === 'publish');
    if (items.length === 0) continue;

    const section = document.createElement('section');
    section.classList.add('widget-blue-section');
    const h3 = document.createElement('h3');
    h3.textContent = label.toUpperCase();
    section.appendChild(h3);

    items.slice(0, 4).forEach(item => {
      const a = document.createElement('a');
      a.href = item.Slug.startsWith('/') ? item.Slug : '/' + item.Slug;
      a.textContent = item.Judul;
      section.appendChild(a);
      section.appendChild(document.createElement('br'));
    });

    container.appendChild(section);
  }
}

// Render daftar berita utama di halaman index
function renderBeritaList() {
  const container = document.getElementById('berita-list');
  if (!container) return;
  container.innerHTML = '';

  const publishedBerita = beritaData.filter(b => b.Status_View.toLowerCase() === 'publish');
  publishedBerita.forEach(item => {
    const article = document.createElement('article');
    article.classList.add('berita-item');

    const title = document.createElement('h2');
    const link = document.createElement('a');
    link.href = item.Slug.startsWith('/') ? item.Slug : '/' + item.Slug;
    link.textContent = item.Judul;
    title.appendChild(link);

    const img = document.createElement('img');
    img.src = item.Gambar || '';
    img.alt = item.Judul;

    const excerpt = document.createElement('p');
    excerpt.textContent = item.Meta_Deskripsi || '';

    article.appendChild(title);
    article.appendChild(img);
    article.appendChild(excerpt);

    container.appendChild(article);
  });
}

// Inisialisasi utama
async function init() {
  try {
    const configValues = await fetchSheet('Config');
    configData = parseConfig(configValues);

    const beritaValues = await fetchSheet('Live Website');
    beritaData = parseBerita(beritaValues);

    renderLogoAndSiteName();
    renderMenu();
    renderHeadline();
    renderWidgets();
    renderBeritaList();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Jalankan inisialisasi saat halaman siap
document.addEventListener('DOMContentLoaded', init);
