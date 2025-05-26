# Sarjana News Website

Website berita dinamis dengan data dan konfigurasi langsung dari Google Spreadsheet.

## Cara Deploy
1. Clone repo ini ke GitHub atau lokal.
2. Pastikan spreadsheet ID dan API Key sudah benar di file `script.js`.
3. Upload ke GitHub Pages atau hosting statis lainnya.
4. Akses website lewat `index.html`

## Struktur File
- index.html : Halaman utama berita
- berita.html : Halaman detail berita
- script.js : Script untuk load data spreadsheet dan interaksi
- style.css : Styling website responsif ala Detik.com dengan nuansa Google
- README.md : Dokumentasi proyek

## Konfigurasi Spreadsheet
Spreadsheet dengan ID: `1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww`

Sheet CONFIG: Atur SITE_NAME, SITE_LOGO, MENU, MENU_LINK, WIDGET_..., COLOR_PRIMARY, HEADLINE_ROLLING, dll

Sheet Live Website: Berisi data berita, dengan kolom seperti Judul, Label, Gambar, Isi, Slug, Meta Deskripsi, View, Tanggal, Type

## Lisensi
Open source, bebas digunakan dan dikembangkan