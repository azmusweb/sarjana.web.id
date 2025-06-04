const sheetID = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const beritaSheet = 'Live Website';
const apiKey = 'AIzaSyDKOClQy1z23Hwjr9HyHmzJbuaPE9Ccbv4';

async function getSheetData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  const rows = data.values;
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((key, i) => obj[key] = row[i] || '');
    return obj;
  });
}

function getSlug() {
  const url = new URLSearchParams(window.location.search);
  return url.get('slug');
}

async function tampilkanIsiBerita() {
  const slug = getSlug();
  const list = await getSheetData(beritaSheet);
  const berita = list.find(b => b['Slug'] === slug);

  if (!berita) {
    document.body.innerHTML = '<h1>Berita tidak ditemukan.</h1>';
    return;
  }

  document.title = berita['Judul'];
  document.querySelector('.judul-berita').textContent = berita['Judul'];
  document.querySelector('.isi-berita').innerHTML = `
    <img src="${berita['Gambar']}" alt="${berita['Judul']}">
    <div class="tanggal">${berita['Tgl/Jam']}</div>
    <div class="isi">${berita['Body']}</div>
  `;
}

tampilkanIsiBerita();
