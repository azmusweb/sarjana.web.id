const SPREADSHEET_ID = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const API_KEY = 'AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs';

let configData = {};
let beritaData = [];

async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gagal fetch sheet ${sheetName}`);
  const data = await res.json();
  return data.values || [];
}

async function loadConfig() {
  const rows = await fetchSheet('Config');
  rows.slice(1).forEach(r => {
    if (r.length >= 2) configData[r[0].trim()] = r[1].trim();
  });
}

async function loadBerita() {
  const rows = await fetchSheet('Live Website');
  beritaData = rows.slice(1).map(r => ({
    judul: r[0] || '',
    label: r[1] || '',
    gambar: r[2] || '',
    isi: r[3] || '',
    slug: r[4] ? r[4].replace(/\.html$/i, '').replace(/^www\./i, '') : '',
    meta: r[5] || '',
    view: r[6] || '',
    tanggal: r[7] || '',
    type: r[8] || '',
  }));
}

function buildLogoAndTitle() {
  const logoImg = document.getElementById('site-logo');
  const siteNameSpan = document.getElementById('site-name');
  const homeUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/') + '/';

  if (configData.SITE_LOGO) {
    logoImg.src = configData.SITE_LOGO;
    logoImg.style.display = 'inline-block';
    siteNameSpan.style.display = 'none';
  } else {
    logoImg.style.display = 'none';
    siteNameSpan.style.display = 'inline-block';
    siteNameSpan.textContent = configData.SITE_NAME || 'Website';
  }

  // Logo / nama website klik ke home
  document.getElementById('logo-link').href = homeUrl;
}

function buildMenu() {
  const menuContainer = document.getElementById('main-nav');
  menuContainer.innerHTML = '';
  if (!configData.MENU) return;

  // Format MENU:
  // MenuUtama,link,submenuSlug1|submenuSlug2|...|submenuSlugN|Menu2,link2,...
  // Kita ambil koma pisah menu utama dan submenu, tanda '|' pisah menu utama
  const menus = configData.MENU.split('|').map(m => m.trim());

  menus.forEach(menuStr => {
    if (!menuStr) return;
    const parts = menuStr.split(',');
    if (parts.length < 2) return;

    const mainMenuName = parts[0];
    let mainMenuLink = parts[1].trim();
    if (mainMenuLink === 'home' || mainMenuLink === '') mainMenuLink = './';

    const subSlugs = parts.slice(2);

    const li = document.createElement('li');
    li.className = 'menu-item';

    const a = document.createElement('a');
    a.href = mainMenuLink;
    a.textContent = mainMenuName;
    li.appendChild(a);

    if (subSlugs.length > 0) {
      const ulSub = document.createElement('ul');
      ulSub.className = 'submenu';

      subSlugs.forEach(slugRaw => {
        const slug = slugRaw.trim().replace(/\.html$/i, '').replace(/^www\./i, '');
        if (!slug) return;
        const berita = beritaData.find(b => b.slug === slug);
        if (!berita) return;

        const subLi = document.createElement('li');
        const subA = document.createElement('a');
        subA.href = `berita.html?slug=${slug}`;
        subA.textContent = berita.judul;
        subLi.appendChild(subA);
        ulSub.appendChild(subLi);
      });

      li.appendChild(ulSub);
    }

    menuContainer.appendChild(li);
  });
}

function buildHeadlineRolling() {
  if (configData.HEADLINE_ROLLING !== 'true') return;
  if (!configData.HEADLINE_LABEL) return;

  const label = configData.HEADLINE_LABEL;
  const headlines = beritaData.filter(b => b.label === label);
  const marquee = document.getElementById('headline-marquee');
  if (!marquee) return;

  marquee.innerHTML = '';
  headlines.forEach(news => {
    const a = document.createElement('a');
    a.href = `berita.html?slug=${news.slug}`;
    a.textContent = news.judul;
    a.style.marginRight = '40px';
    marquee.appendChild(a);
  });
}

function buildWidgets() {
  // Widget kiri
  const leftWidgetLabels = (configData.WIDGET_LEFT || '').split(',').map(w => w.trim()).filter(Boolean);
  const leftContainer = document.getElementById('left-widgets');
  leftContainer.innerHTML = '';
  leftWidgetLabels.forEach(label => {
    const filteredNews = beritaData.filter(b => b.label === label);
    if (!filteredNews.length) return;

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'widget-item';
    widgetDiv.innerHTML = `<h3>${label}</h3>`;
    filteredNews.slice(0, 2).forEach(news => {
      const p = document.createElement('p');
      p.innerHTML = `<a href="berita.html?slug=${news.slug}">${news.judul}</a>`;
      widgetDiv.appendChild(p);
    });
    leftContainer.appendChild(widgetDiv);
  });

  // Widget kanan
  const rightWidgetLabels = (configData.WIDGET_RIGHT || '').split(',').map(w => w.trim()).filter(Boolean);
  const rightContainer = document.getElementById('right-widgets');
  rightContainer.innerHTML = '';
  rightWidgetLabels.forEach(label => {
    const filteredNews = beritaData.filter(b => b.label === label);
    if (!filteredNews.length) return;

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'widget-item';
    widgetDiv.innerHTML = `<h3>${label}</h3>`;
    filteredNews.slice(0, 2).forEach(news => {
      const p = document.createElement('p');
      p.innerHTML = `<a href="berita.html?slug=${news.slug}">${news.judul}</a>`;
      widgetDiv.appendChild(p);
    });
    rightContainer.appendChild(widgetDiv);
  });

  // Widget biru 3 bilah (WIDGET_LABEL_1,2,3)
  for (let i = 1; i <= 3; i++) {
    const labelKey = `WIDGET_LABEL_${i}`;
    const widgetLabel = configData[labelKey];
    if (!widgetLabel) continue;

    const container = document.getElementById(`widget-blue-${i}`);
    if (!container) continue;

    const filteredNews = beritaData.filter(b => b.label === widgetLabel);
    container.innerHTML = `<h3>${widgetLabel}</h3>`;

    filteredNews.slice(0, 3).forEach(news => {
      const p = document.createElement('p');
      p.innerHTML = `<a href="berita.html?slug=${news.slug}">${news.judul}</a>`;
      container.appendChild(p);
    });
  }
}

async function init() {
  try {
    await loadConfig();
    await loadBerita();

    buildLogoAndTitle();
    buildMenu();
    buildHeadlineRolling();
    buildWidgets();

  } catch (e) {
    console.error('Init error:', e);
  }
}

window.onload = init;
