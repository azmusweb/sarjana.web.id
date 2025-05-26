const SPREADSHEET_ID = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const API_KEY = 'AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs';

async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch ' + sheetName);
  const data = await response.json();
  return data.values;
}

function parseMenu(config) {
  // config string contoh: "Menu1|Sub1,Sub2;Menu2|Sub3,Sub4"
  // Tapi sesuai request user, format adalah: "Menu1,Menu2|Sub1,Sub2"
  // Jadi, menu dan submenu dipisah tanda |, submenu dipisah koma
  let menus = [];
  if (!config) return menus;
  let parts = config.split('|');
  let mainMenus = parts[0].split(',');
  let subMenus = parts[1] ? parts[1].split(',') : [];
  mainMenus.forEach(menu => {
    menus.push({title: menu.trim(), submenu: []});
  });
  // Karena format submenu tidak spesifik, saya buat submenu kosong dulu,
  // nanti bisa dikembangkan sesuai data di config.
  return menus;
}

function createMenuDOM(menus) {
  const nav = document.getElementById('main-nav');
  nav.innerHTML = '';
  menus.forEach(menu => {
    const li = document.createElement('div');
    li.className = 'menu-item';
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = menu.title;
    li.appendChild(a);

    if (menu.submenu && menu.submenu.length > 0) {
      const submenuDiv = document.createElement('div');
      submenuDiv.className = 'submenu';
      menu.submenu.forEach(sub => {
        const suba = document.createElement('a');
        suba.href = '#';
        suba.textContent = sub;
        submenuDiv.appendChild(suba);
      });
      li.appendChild(submenuDiv);
    }
    nav.appendChild(li);
  });
}

function setLogoAndTitle(config) {
  const logoUrl = config['logo_url'] || '';
  const siteName = config['site_name'] || 'Website';
  const logoImg = document.getElementById('site-logo');
  const siteNameSpan = document.getElementById('site-name');
  if (logoUrl) {
    logoImg.src = logoUrl;
    logoImg.style.display = 'inline-block';
    siteNameSpan.textContent = '';
  } else {
    logoImg.style.display = 'none';
    siteNameSpan.textContent = siteName;
  }
}

function createHeadlineRolling(beritaData) {
  const marquee = document.getElementById('headline-marquee');
  marquee.innerHTML = '';
  beritaData.forEach(row => {
    const judul = row[0];
    if (judul) {
      const a = document.createElement('a');
      a.href = 'berita.html?slug=' + (row[4] || '#');
      a.textContent = judul;
      a.style.marginRight = '30px';
      marquee.appendChild(a);
    }
  });
}

function createWidgets(widgetContainers, beritaData, labelFilter) {
  widgetContainers.forEach(({element, label}) => {
    element.innerHTML = '';
    let filtered = beritaData.filter(row => row[1] && row[1].toLowerCase().includes(label.toLowerCase()));
    filtered.slice(0, 5).forEach(row => {
      const div = document.createElement('div');
      div.className = 'widget-item';
      div.textContent = row[0];
      element.appendChild(div);
    });
  });
}

async function main() {
  try {
    // Ambil Config dan Live Website
    const configData = await fetchSheet('Config');
    const liveData = await fetchSheet('Live Website');

    // Parsing config ke object kunci-nilai
    const config = {};
    configData.forEach(row => {
      if (row[0]) config[row[0].toLowerCase()] = row[1] || '';
    });

    // Setup logo dan nama web
    setLogoAndTitle({
      logo_url: config['logo'] || '',
      site_name: config['site_name'] || 'Sarjana'
    });

    // Buat menu dari config menu (contoh: config menu="Home,News,Contact|Sub1,Sub2")
    const menus = parseMenu(config['menu'] || '');
    createMenuDOM(menus);

    // Headline rolling
    createHeadlineRolling(liveData.slice(1));

    // Widget setup (contoh label yang diambil widget dari config widget-label1, widget-label2)
    const leftWidgets = document.getElementById('left-widgets');
    const rightWidgets = document.getElementById('right-widgets');
    const blueWidget1 = document.getElementById('widget-blue-1');
    const blueWidget2 = document.getElementById('widget-blue-2');
    const blueWidget3 = document.getElementById('widget-blue-3');

    createWidgets([{element: leftWidgets, label: config['widget-label-left'] || ''}], liveData.slice(1));
    createWidgets([{element: rightWidgets, label: config['widget-label-right'] || ''}], liveData.slice(1));
    createWidgets([{element: blueWidget1, label: config['widget-label-blue1'] || ''}], liveData.slice(1));
    createWidgets([{element: blueWidget2, label: config['widget-label-blue2'] || ''}], liveData.slice(1));
    createWidgets([{element: blueWidget3, label: config['widget-label-blue3'] || ''}], liveData.slice(1));

  } catch (e) {
    console.error(e);
  }
}

window.onload = main;
