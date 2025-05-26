const SPREADSHEET_ID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const API_KEY = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";
const SHEET_CONFIG = "CONFIG";
const SHEET_NEWS = "Live Website";

let configData = {};
let newsData = [];

function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  return fetch(url).then(res => res.json());
}

function parseConfig(values) {
  let config = {};
  for (const row of values) {
    if(row.length >= 2){
      config[row[0].trim()] = row[1].trim();
    }
  }
  return config;
}

function buildMenu(menuStr, menuLinkStr) {
  const menus = menuStr.split('|').map(m => m.trim());
  const links = menuLinkStr.split('|').map(l => l.trim());
  let html = '';
  for (let i=0; i < menus.length; i++) {
    const menu = menus[i];
    const submenuItems = menu.split(',');
    const linkItems = links[i].split(',');
    if(submenuItems.length > 1) {
      // Dropdown menu
      html += `<div class="dropdown">
        <a href="${linkItems[0]}" class="dropbtn">${submenuItems[0]}</a>
        <div class="dropdown-content">`;
      for(let j=1; j<submenuItems.length; j++){
        html += `<a href="${linkItems[j]}">${submenuItems[j]}</a>`;
      }
      html += `</div></div>`;
    } else {
      // Single menu
      html += `<a href="${linkItems[0]}">${menu}</a>`;
    }
  }
  return html;
}

function renderHeader() {
  let logo = configData.SITE_LOGO || "";
  let siteName = configData.SITE_NAME || "Sarjana";
  let logoHtml = logo ? `<img src="${logo}" alt="${siteName}" />` : siteName;
  document.getElementById("logo").innerHTML = `<a href="/" id="homeLink">${logoHtml}</a>`;

  const navMenu = document.getElementById("navMenu");
  if(configData.MENU && configData.MENU_LINK) {
    navMenu.innerHTML = buildMenu(configData.MENU, configData.MENU_LINK);
  }
}

function renderHeadline() {
  if(configData.HEADLINE_ROLLING !== "TRUE") {
    document.getElementById("headlineRolling").style.display = "none";
    return;
  }
  let label = configData.HEADLINE_LABEL || "headline";
  let headlines = newsData.filter(item => item.Label.toLowerCase() === label.toLowerCase());
  if(headlines.length === 0){
    document.getElementById("headlineRolling").style.display = "none";
    return;
  }
  let headlineText = headlines.map(h => `<a href="/${h.Slug}">${h.Judul}</a>`).join(' | ');
  document.getElementById("headlineRolling").innerHTML = headlineText;
}

function renderWidgets() {
  // Left and Right widgets (by config key)
  const widgetLeftIds = (configData.WIDGET_LEFT || "").split(',');
  const widgetRightIds = (configData.WIDGET_RIGHT || "").split(',');
  const widgetBlue1 = configData.WIDGET_BLUE_1 || "";
  const widgetBlue2 = configData.WIDGET_BLUE_2 || "";
  const widgetBlue3 = configData.WIDGET_BLUE_3 || "";

  const widgetLabel1 = configData.WIDGET_LABEL_1 || "";
  const widgetLabel2 = configData.WIDGET_LABEL_2 || "";
  const widgetLabel3 = configData.WIDGET_LABEL_3 || "";

  for(let i=0; i < 2; i++){
    const leftWidgetId = widgetLeftIds[i] || "";
    const rightWidgetId = widgetRightIds[i] || "";
    document.getElementById(`widgetLeft${i+1}`).innerHTML = renderWidgetContent(leftWidgetId, widgetLabel1);
    document.getElementById(`widgetRight${i+1}`).innerHTML = renderWidgetContent(rightWidgetId, widgetLabel2);
  }

  document.getElementById("widgetBlue1").innerHTML = renderWidgetContent(widgetBlue1, widgetLabel1);
  document.getElementById("widgetBlue2").innerHTML = renderWidgetContent(widgetBlue2, widgetLabel2);
  document.getElementById("widgetBlue3").innerHTML = renderWidgetContent(widgetBlue3, widgetLabel3);
}

function renderWidgetContent(widgetId, label) {
  // For now widget content is latest 2 posts from label filtered
  if(!label || !widgetId) return "";
  let filteredPosts = newsData.filter(item => item.Label.toLowerCase() === label.toLowerCase()).slice(0, 2);
  if(filteredPosts.length === 0) return `<div class="widget-empty">No posts for ${label}</div>`;
  let html = `<h4>${widgetId}</h4>`;
  filteredPosts.forEach(post => {
    html += `<div class="widget-post">
      <a href="/${post.Slug}">${post.Judul}</a>
    </div>`;
  });
  return html;
}

function renderPosts() {
  const postList = document.getElementById("postList");
  let html = "";
  newsData.forEach(post => {
    html += `<div class="post-card">
      <img src="${post.Gambar}" alt="${post.Judul}" />
      <div class="post-content">
        <h3>${post.Judul}</h3>
        <p>${post.Meta_Deskripsi || post.Isi.substring(0,100) + "..."}</p>
        <a class="read-more" href="/${post.Slug}">Baca Selengkapnya</a>
      </div>
    </div>`;
  });
  postList.innerHTML = html;
}

function fetchData() {
  Promise.all([fetchSheet(SHEET_CONFIG), fetchSheet(SHEET_NEWS)])
    .then(results => {
      configData = parseConfig(results[0].values);
      newsData = parseNews(results[1].values);
      applyThemeColors();
      renderHeader();
      renderHeadline();
      renderWidgets();
      renderPosts();
      renderFooter();
    })
    .catch(console.error);
}

function parseNews(values) {
  const keys = ["Judul","Label","Gambar","Isi","Slug","Meta_Deskripsi","View","Tanggal","Type"];
  let news = [];
  for(let i=1; i < values.length; i++) {
    let row = values[i];
    if(row.length < keys.length) continue;
    let item = {};
    for(let j=0; j < keys.length; j++) {
      item[keys[j]] = row[j] || "";
    }
    news.push(item);
  }
  return news;
}

function applyThemeColors() {
  if(configData.COLOR_PRIMARY){
    document.documentElement.style.setProperty('--color-primary', configData.COLOR_PRIMARY);
  }
  if(configData.COLOR_SECONDARY){
    document.documentElement.style.setProperty('--color-secondary', configData.COLOR_SECONDARY);
  }
}

function renderFooter() {
  document.getElementById("footerText").innerText = configData.FOOTER_TEXT || "© 2025 Sarjana - All Rights Reserved";
}

document.addEventListener("DOMContentLoaded", fetchData);