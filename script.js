const SPREADSHEET_ID = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const API_KEY = 'AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs';

let configData = {};
let beritaData = [];

async function fetchSpreadsheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Gagal mengambil data ' + sheetName);
  const data = await response.json();
  return data.values || [];
}

async function loadConfig() {
  const rows = await fetchSpreadsheet('Config');
  rows.slice(1).forEach(row => {
    if (row.length >= 2) configData[row[0].trim()] = row[1].trim();
  });
}

async function loadBerita() {
  const rows = await fetchSpreadsheet('Live Website');
  beritaData = rows.slice(1).map(row => ({
    judul: row[0] || '',
    label: row[1] || '',
    gambar: row[2] || '',
    isi: row[3] || '',
    slug: row[4] || '',
    meta: row[5] || '',
    view: row[6] || '',
    tanggal: row[7] || '',
    type: row[8] || '',
  }));
}

function buildMenu() {
  const menuContainer = document.getElementById('main-nav');
  menuContainer.innerHTML = '';
  if (!configData.MENU) return;

  // Format MENU: Menu Utama,link,submenu|Menu2,link,submenu
  const menuGroups = configData.MENU.split('|').map(item => item.trim());

  menuGroups.forEach(menuItem => {
    const parts = menuItem.split(',');
    if (parts.length < 2) return;

    const mainMenuName = parts[0];
    const mainMenuLink = parts[1];
    const subMenus = parts.slice(2);

    const li = document.createElement('li');
    li.className = 'menu-item';

    const a = document.createElement('a');
    a.href = mainMenuLink;
    a.textContent = mainMenuName;
    li.appendChild(a);

    if (subMenus.length > 0) {
      const subUl = document.createElement('ul');
      subUl.className = 'submenu';

      subMenus.forEach(subSlug => {
        // Cari berita yang slugnya sama dengan subSlug
        const subBerita = beritaData.find(b => b.slug === subSlug);
        if (!subBerita) return;

        const subLi = document.createElement('li');
        const subA = document.createElement('a');
        subA.href = `berita.html?slug=${subBerita.slug}`;
        subA.textContent = subBerita.judul;
        subLi.appendChild(subA);
        subUl.appendChild(subLi);
      });
      li.appendChild(subUl);
    }

    menuContainer.appendChild(li);
  });
}

function setupLogoAndTitle() {
  const logoUrl = configData.SITE_LOGO || '';
  const siteName = configData.SITE_NAME || 'Website';

  const logoImg = document.getElementById('site-logo');
  const siteNameSpan = document.getElementById('site-name');

  if (logoUrl) {
    logoImg.src = logoUrl;
    logoImg.style.display = 'inline-block';
    siteNameSpan.style.display = 'none';
  } else {
    logoImg.style.display = 'none';
    siteNameSpan.textContent = siteName;
    siteNameSpan.style.display = 'inline-block';
  }
}

function createHeadlineRolling() {
  if (configData.HEADLINE_ROLLING !== 'true') return;
  if (!configData.HEADLINE_LABEL) return;

  const label = configData.HEADLINE_LABEL;
  const headlines = beritaData.filter(b => b.label === label);

  const marquee = document.getElementById('headline-marquee');
  if (!marquee) return;

  marquee.innerHTML = '';

  headlines.forEach((news, idx) => {
    const a = document.createElement('a');
    a.href = `berita.html?slug=${news.slug}`;
    a.textContent = news.judul;
    a.style.marginRight = '40px';
    marquee.appendChild(a);
  });
}

function buildWidgets() {
  // Widget kiri
  const leftWidgetsIds = (configData.WIDGET_LEFT || '').split(',').map(w => w.trim()).filter(Boolean);
  const leftContainer = document.getElementById('left-widgets');
  leftContainer.innerHTML = '';
  leftWidgetsIds.forEach(widgetName => {
    // Ambil berita sesuai label widget (widgetName dipakai sebagai label)
    const widgetBerita = beritaData.filter(b => b.label === widgetName);
    if (widgetBerita.length === 0) return;

    const div = document.createElement('div');
    div.className = 'widget-item';
    div.innerHTML = `<h3>${widgetName}</h3>`;
    widgetBerita.slice(0, 2).forEach(b => {
      const p = document.createElement('p');
      p.innerHTML = `<a href="berita.html?slug=${b.slug}">${b.judul}</a>`;
      div.appendChild(p);
    });
    leftContainer.appendChild(div);
  });

  // Widget kanan
  const rightWidgetsIds = (configData.WIDGET_RIGHT || '').split(',').map(w => w.trim()).filter(Boolean);
  const rightContainer = document.getElementById('right-widgets');
  rightContainer.innerHTML = '';
  rightWidgetsIds.forEach(widgetName => {
    const widgetBerita = beritaData.filter(b => b.label === widgetName);
    if (widgetBerita.length === 0) return;

    const div = document.createElement('div');
    div.className = 'widget-item';
    div.innerHTML = `<h3>${widgetName}</h3>`;
    widgetBerita.slice(0, 2).forEach(b => {
      const p = document.createElement('p');
      p.innerHTML = `<a href="berita.html?slug=${b.slug}">${b.judul}</a>`;
      div.appendChild(p);
    });
    rightContainer.appendChild(div);
  });

  // Widget biru 3 bilah
  for (let i = 1; i <= 3; i++) {
    const widgetLabelKey = `WIDGET_LABEL_${i}`;
    const widgetBlueKey = `WIDGET_BLUE_${i}`;
    const widgetLabel = configData[widgetLabelKey];
    const widgetBlueContainer = document.getElementById(`widget-blue-${i}`);

    if (!widgetLabel || !widgetBlueContainer) continue;

    const widgetBerita = beritaData.filter(b => b.label === widgetLabel);
    widgetBlueContainer.innerHTML = `<h3>${widgetLabel}</h3>`;

    widgetBerita.slice(0, 3).forEach(b => {
      const p = document.createElement('p');
      p.innerHTML = `<a href="berita.html?slug=${b.slug}">${b.judul}</a>`;
      widgetBlueContainer.appendChild(p);
    });
  }
}

async function init() {
  try {
    await loadConfig();
    await loadBerita();

    setupLogoAndTitle();
    buildMenu();
    createHeadlineRolling();
    buildWidgets();

    // Anda bisa tambahkan inisialisasi lain di sini
  } catch (error) {
    console.error('Error initializing website:', error);
  }
}

window.onload = init;
