const SHEET_ID = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const API_KEY = 'AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs';
const CONFIG_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Config?key=${API_KEY}`;
const NEWS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Live%20Website?key=${API_KEY}`;

function fetchConfig() {
  fetch(CONFIG_URL)
    .then(res => res.json())
    .then(data => {
      const rows = data.values;
      const config = Object.fromEntries(rows.map(row => [row[0], row[1]]));
      document.getElementById('logo').textContent = config['NAMA_WEBSITE'] || 'Sarjana';
      if (config['WARNA']) document.documentElement.style.setProperty('--tema', config['WARNA']);

      const menu = config['MENU']?.split(',').map(item => `<a href="#">${item.trim()}</a>`).join('') || '';
      document.getElementById('menu').innerHTML = menu;
    });
}

function fetchNews() {
  fetch(NEWS_URL)
    .then(res => res.json())
    .then(data => {
      const rows = data.values.slice(1); // skip header
      const beritaUtama = rows[0];
      const listBerita = rows.slice(1);

      if (document.getElementById('berita-utama')) {
        document.getElementById('berita-utama').innerHTML = `
          <h2>${beritaUtama[0]}</h2>
          <img src="${beritaUtama[2]}" alt="${beritaUtama[0]}" width="100%">
          <p>${beritaUtama[3].slice(0, 200)}...</p>
        `;
      }

      if (document.getElementById('daftar-berita')) {
        document.getElementById('daftar-berita').innerHTML = listBerita.map(row => `
          <div>
            <h3><a href="berita.html?slug=${row[4]}">${row[0]}</a></h3>
            <small>${row[7]}</small>
          </div>
        `).join('');
      }

      if (document.getElementById('isi-berita')) {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        const berita = rows.find(r => r[4] === slug);
        if (berita) {
          document.getElementById('isi-berita').innerHTML = `
            <h1>${berita[0]}</h1>
            <img src="${berita[2]}" alt="${berita[0]}" width="100%">
            <p>${berita[3]}</p>
          `;
        } else {
          document.getElementById('isi-berita').innerHTML = '<p>Berita tidak ditemukan.</p>';
        }
      }
    });
}

fetchConfig();
fetchNews();
