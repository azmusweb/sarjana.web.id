// script.js

const SPREADSHEET_ID = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNOfHHoEIFZN8DpQ8-59bc4RqeGPaBo_W32s2ypXHwWOPDeMG_1HBfcxhIThBLc7jcYQ/exec';

async function fetchData(params = {}) {
  const url = new URL(APPS_SCRIPT_URL);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal mengambil data');
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

function renderHeader(config) {
  const header = document.getElementById('header');
  // Contoh render header dari config (sesuaikan dari data config asli)
  header.innerHTML = `
    <h1>${config.title || 'Sarjana Web ID'}</h1>
    <nav>
      ${config.menu ? config.menu.map(item => `<a href="${item.link}">${item.name}</a>`).join(' | ') : ''}
    </nav>
  `;
}

function renderFooter(config) {
  const footer = document.getElementById('footer');
  footer.innerHTML = `
    <p>&copy; ${new Date().getFullYear()} ${config.title || 'Sarjana Web ID'}</p>
  `;
}

function renderMainContent(beritaList) {
  const main = document.getElementById('main-content');
  if (!beritaList || beritaList.length === 0) {
    main.innerHTML = '<p>Tidak ada berita tersedia.</p>';
    return;
  }
  main.innerHTML = beritaList.map(berita => `
    <article class="berita">
      <h2>${berita.Judul}</h2>
      <img src="${berita.Gambar}" alt="${berita.Judul}" />
      <p>${berita.Isi}</p>
      <small>${berita.Tanggal}</small>
    </article>
  `).join('');
}

async function init() {
  // Ambil config
  const configData = await fetchData({ sheet: 'Config' });
  const config = configData?.data?.[0] || {
    title: 'Sarjana Web ID',
    menu: [
      { name: 'Home', link: '/' }
    ]
  };

  // Ambil berita
  const beritaData = await fetchData({ sheet: 'Live Website' });
  const beritaList = beritaData?.data || [];

  renderHeader(config);
  renderMainContent(beritaList);
  renderFooter(config);
}

document.addEventListener('DOMContentLoaded', init);
