async function ambilSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.values;
}

function tampilkanBeritaDetail(data) {
  const [header, ...berita] = data;
  const indexSlug = header.indexOf("Slug");
  const indexJudul = header.indexOf("Judul");
  const indexIsi = header.indexOf("Body");
  const indexGambar = header.indexOf("Gambar");
  const indexTanggal = header.indexOf("Tgl/Jam");

  const hasil = berita.find(row => (row[indexSlug] || '').toLowerCase() === slug);

  if (!hasil) {
    document.getElementById('detail-berita').innerHTML = "<p>Berita tidak ditemukan.</p>";
    return;
  }

  const html = `
    <h1>${hasil[indexJudul]}</h1>
    <p><em>${hasil[indexTanggal]}</em></p>
    <img src="${hasil[indexGambar]}" alt="${hasil[indexJudul]}" style="width:100%;max-height:400px;object-fit:cover;margin-bottom:1rem;">
    <div>${hasil[indexIsi]}</div>
  `;
  document.getElementById('detail-berita').innerHTML = html;
}

function buatMenu(menuData) {
  const nav = document.getElementById('menu');
  const list = document.createElement('ul');
  menuData.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = item;
    li.appendChild(a);
    list.appendChild(li);
  });
  nav.appendChild(list);
}

function tampilkanSidebar(widget) {
  const aside = document.getElementById('sidebar');
  aside.innerHTML = widget;
}

function tampilkanFooter(footerText) {
  document.getElementById('footer').innerHTML = footerText;
}

async function inisialisasi() {
  const config = await ambilSheet(configSheet);
  const konten = await ambilSheet(contentSheet);
  const dataConfig = {};
  config.forEach(([fungsi, isi]) => {
    dataConfig[fungsi] = isi;
  });

  document.body.style.backgroundColor = dataConfig['warna_dasar'] || '#f5f5f5';
  document.body.style.color = dataConfig['warna_teks'] || '#333';
  document.querySelector('link[rel=\"icon\"]').href = dataConfig['favicon'] || '';
  document.getElementById('logo').src = dataConfig['logo'];
  const menuArray = dataConfig['menu'].split(';');
  buatMenu(menuArray);
  tampilkanSidebar(dataConfig['iklan_sidebar'] || '');
  tampilkanFooter(dataConfig['footer_teks'] || '');

  tampilkanBeritaDetail(konten);
}

inisialisasi();
