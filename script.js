const SPREADSHEET_ID = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const API_KEY = 'AIzaSyDKOClQy1z23Hwjr9HyHmzJbuaPE9Ccbv4';
const SHEET_NAME = 'Live Website';

// Fungsi untuk ambil data berita dari Google Sheets
async function fetchBerita() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal mengambil data dari spreadsheet');
        
        const data = await response.json();
        const rows = data.values;

        if (!rows || rows.length < 2) {
            throw new Error('Data berita tidak ditemukan atau kosong');
        }

        // Baris pertama adalah header kolom, jadi kita skip
        const beritaList = rows.slice(1).map(row => {
            return {
                judul: row[0] || '',
                label: row[1] || '',
                gambar: row[2] || '',
                isi: row[3] || '',
                slug: row[4] || '',
                meta: row[5] || '',
                view: row[6] || '',
                tanggal: row[7] || '',
                type: row[8] || ''
            };
        });

        return beritaList;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Fungsi untuk tampilkan daftar berita di halaman index.html
async function loadBeritaList() {
    const container = document.getElementById('berita-container');
    container.innerHTML = '<p>Loading berita...</p>';

    const beritaList = await fetchBerita();

    if (beritaList.length === 0) {
        container.innerHTML = '<p>Tidak ada berita ditemukan.</p>';
        return;
    }

    container.innerHTML = '';
    beritaList.forEach(berita => {
        const div = document.createElement('div');
        div.className = 'berita-item';
        div.innerHTML = `
            <img src="${berita.gambar}" alt="${berita.judul}" />
            <h3>${berita.judul}</h3>
            <p>${berita.isi.substring(0, 100)}...</p>
        `;
        div.onclick = () => {
            window.location.href = `berita.html?slug=${berita.slug}`;
        }
        container.appendChild(div);
    });
}

// Fungsi untuk tampilkan detail berita di halaman berita.html
async function loadBeritaDetail() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const detailContainer = document.getElementById('berita-detail');
    
    detailContainer.innerHTML = '<p>Loading berita...</p>';

    if (!slug) {
        detailContainer.innerHTML = "<p>Berita tidak ditemukan.</p>";
        return;
    }

    const beritaList = await fetchBerita();
    const berita = beritaList.find(b => b.slug === slug);

    if (!berita) {
        detailContainer.innerHTML = "<p>Berita tidak ditemukan.</p>";
        return;
    }

    detailContainer.innerHTML = `
        <h2>${berita.judul}</h2>
        <p><em>Tanggal: ${berita.tanggal}</em></p>
        <img src="${berita.gambar}" alt="${berita.judul}" />
        <p>${berita.isi}</p>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('berita-container')) {
        loadBeritaList();
    }
    if (document.getElementById('berita-detail')) {
        loadBeritaDetail();
    }
});
