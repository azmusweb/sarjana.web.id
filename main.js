const sheetID = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const configSheet = 'Config';
const beritaSheet = 'Live Website';

async function getSheetData(sheetName) {
  const url = `https://opensheet.vercel.app/${sheetID}/${sheetName}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch sheet ${sheetName}`);
  return res.json();
}

async function applyConfig() {
  const config = await getSheetData(configSheet);
  config.forEach(item => {
    const f = item['FUNGSI'];
    const w = item['WEBSITE'];

    switch(f) {
      case 'warna':
        document.documentElement.style.setProperty('--main-color', w);
        break;
      case 'judul':
        document.title = w;
        break;
      case 'logo':
        const logo = document.querySelector('.logo');
        if (logo) logo.src = w;
        break;
      case 'menu':
        const menu = document.querySelector('.menu-nav');
        if (menu) menu.innerHTML = w;
        break;
      case 'footer':
        const footer = document.querySelector('footer');
        if (footer) footer.innerHTML = w;
        break;
      case 'bilahberita':
        const bilah = document.querySelector('.bilah-berita');
        if (bilah) bilah.textContent = w;
        break;
      case 'iklanatas':
        const iklanTop = document.querySelector('.ads-top');
        if (iklanTop) iklanTop.innerHTML = w;
        break;
      case 'iklankanan':
        const iklanKanan = document.querySelector('.ads-sidebar');
        if (iklanKanan) iklanKanan.innerHTML = w;
        break;
    }
  });
}

function createBeritaItem(data) {
  // Contoh sederhana membuat elemen berita, sesuaikan dengan struktur datamu
  // data harus punya kolom: Judul, Label, Gambar, Isi, Slug, Meta Deskripsi, View, Tanggal, Type
  const div = document.createElement('div');
  div.className = 'berita-item';

  div.innerHTML = `
    <img src="${data.Gambar}" alt="${data.Judul}" class="berita-img" />
    <h2 class="berita-judul">${data.Judul}</h2>
    <p class="berita-label">${data.Label}</p>
    <p class="berita-meta">${data.Tanggal}</p>
    <p class="berita-isi">${data.Isi.substring(0, 150)}...</p>
    <a href="berita.html?slug=${encodeURIComponent(data.Slug)}" class="berita-link">Baca Selengkapnya</a>
  `;
  return div;
}

async function loadBerita() {
  const beritaList = await getSheetData(beritaSheet);
  const container = document.querySelector('.berita-container');
  if (!container) return;
  container.innerHTML = ''; // kosongkan dulu

  // filter dan sortir berita yang ingin ditampilkan jika perlu
  // contoh filter status view aktif dan type berita saja
  const aktifBerita = beritaList.filter(b => b.View === 'aktif' && b.Type === 'berita');

  aktifBerita.forEach(item => {
    const beritaEl = createBeritaItem(item);
    container.appendChild(beritaEl);
  });
}

async function init() {
  try {
    await applyConfig();
    await loadBerita();
  } catch (e) {
    console.error('Error:', e);
  }
}

document.addEventListener('DOMContentLoaded', init);
