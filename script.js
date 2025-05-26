// Contoh sederhana pengambilan data dari Google Spreadsheet
// Pastikan spreadsheet Anda sudah disetting untuk dapat diakses publik dengan API yang sesuai
// Berikut contoh dummy data sebagai ilustrasi

const beritaDummy = [
    {
        judul: "Berita Pertama Sarjana V.3",
        gambar: "https://via.placeholder.com/400x200?text=Berita+1",
        isi: "Ini adalah isi berita pertama yang menarik.",
        slug: "berita-pertama-sarjana",
        tanggal: "2025-05-26"
    },
    {
        judul: "Berita Kedua Sarjana V.3",
        gambar: "https://via.placeholder.com/400x200?text=Berita+2",
        isi: "Ini adalah isi berita kedua yang tidak kalah menarik.",
        slug: "berita-kedua-sarjana",
        tanggal: "2025-05-25"
    }
];

// Fungsi untuk tampilkan daftar berita di halaman index.html
function loadBeritaList() {
    const container = document.getElementById('berita-container');
    container.innerHTML = '';

    beritaDummy.forEach(berita => {
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
function loadBeritaDetail() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const detailContainer = document.getElementById('berita-detail');

    if (!slug) {
        detailContainer.innerHTML = "<p>Berita tidak ditemukan.</p>";
        return;
    }

    const berita = beritaDummy.find(b => b.slug === slug);
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

// Jalankan fungsi sesuai halaman
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('berita-container')) {
        loadBeritaList();
    }
    if (document.getElementById('berita-detail')) {
        loadBeritaDetail();
    }
});
