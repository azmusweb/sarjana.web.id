async function ambilSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.values;
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

function tampilkanBerita(data) {
  const container = document.getElementById('konten-berita');
  const [header, ...konten] = data;
  konten.forEach(row => {
    const artikel = document.createElement('article');
    artikel.innerHTML = `
      <h2>${row[0]}</h2>
      <img src="${row[2]}" alt="${row[0]}" style="width:100%;max-height:300px;object-fit:cover;" />
      <p>${row[3].substring(0, 200)}...</p>
      <a href="#">Selengkapnya</a>
    `;
    container.appendChild(artikel);
  });
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

  // Terapkan konfigurasi
  document.body.style.backgroundColor = dataConfig['warna_dasar'] || '#f5f5f5';
  document.body.style.color = dataConfig['warna_teks'] || '#333';
  document.querySelector('link[rel=\"icon\"]').href = dataConfig['favicon'] || '';

  // Logo
  document.getElementById('logo').src = dataConfig['logo'];

  // Menu
  const menuArray = dataConfig['menu'].split(';');
  buatMenu(menuArray);

  // Sidebar
  tampilkanSidebar(dataConfig['iklan_sidebar'] || '');

  // Footer
  tampilkanFooter(dataConfig['footer_teks'] || '');

  // Konten berita
  tampilkanBerita(konten);
}

inisialisasi();
