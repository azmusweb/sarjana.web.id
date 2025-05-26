// script.js

const SPREADSHEET_ID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const API_KEY = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";
const CONFIG_SHEET = "Config";
const CONTENT_SHEET = "Live Website";

const fetchSheet = async (sheetName) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const rows = data.values;
  const headers = rows.shift();
  return rows.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i] || ""])));
};

const renderMenu = (configs) => {
  const nav = document.getElementById("main-nav");
  const menuConfig = configs.find((c) => c.FUNGSI.toLowerCase() === "menu");
  if (!menuConfig) return;

  const items = menuConfig.WEBSITE.split(',');
  const html = items.map((item) => {
    if (item.includes("|")) {
      const [main, ...subs] = item.split('|');
      const submenu = subs.map(s => `<li><a href="#">${s.trim()}</a></li>`).join('');
      return `<div class="dropdown">
        <button class="dropbtn">${main.trim()}</button>
        <div class="dropdown-content">${submenu}</div>
      </div>`;
    } else {
      return `<a href="#">${item.trim()}</a>`;
    }
  }).join("");
  nav.innerHTML = html;
};

const renderWidgets = (configs, posts) => {
  const getWidgets = (fungsi) => {
    const c = configs.find((x) => x.FUNGSI.toLowerCase() === fungsi.toLowerCase());
    return c ? c.WEBSITE.split(',') : [];
  };

  const widgetArea = (id, labels) => {
    const el = document.getElementById(id);
    if (!el) return;
    const html = posts.filter(p => labels.includes(p.Label)).map(post => `
      <div class="widget-item">
        <h4>${post.Judul}</h4>
        <p>${post.Body.substring(0, 100)}...</p>
      </div>
    `).join('');
    el.innerHTML = html;
  };

  widgetArea('left-widgets', getWidgets('widget kiri'));
  widgetArea('right-widgets', getWidgets('widget kanan'));
  widgetArea('widget-blue-1', getWidgets('widget bawah 1'));
  widgetArea('widget-blue-2', getWidgets('widget bawah 2'));
  widgetArea('widget-blue-3', getWidgets('widget bawah 3'));
};

const init = async () => {
  const [configs, posts] = await Promise.all([
    fetchSheet(CONFIG_SHEET),
    fetchSheet(CONTENT_SHEET)
  ]);

  renderMenu(configs);
  renderWidgets(configs, posts);
};

init();
