# Sarjana News Website

Website berita dinamis berbasis Google Spreadsheet, tampilan profesional mirip Detik, dengan konfigurasi penuh dari spreadsheet.

---

## Struktur Spreadsheet
Spreadsheet harus memiliki dua tab:

### 1. Sheet: `Config`
Berisi konfigurasi situs. Contoh:

| FUNGSI             | WEBSITE                                                            |
|-------------------|---------------------------------------------------------------------|
| SITE_NAME          | Sarjana                                                            |
| SITE_LOGO          | (kosong atau isi URL logo jika ada, contoh: https://example.com/logo.png) |
| MENU               | Home,index | News,news,politik,ekonomi,sport                       |
| MENU_LINK          | index | news,news,news,news                                       |
| MENU_SEPARATOR     | ,                                                                 |
| WIDGET_LEFT        | widget1,widget2                                                    |
| WIDGET_RIGHT       | widget3,widget4                                                    |
| WIDGET_BLUE_1      | widget5                                                            |
| WIDGET_BLUE_2      | widget6                                                            |
| WIDGET_BLUE_3      | widget7                                                            |
| WIDGET_LABEL_1     | politik                                                            |
| WIDGET_LABEL_2     | ekonomi                                                            |
| WIDGET_LABEL_3     | sport                                                              |
| COLOR_PRIMARY      | #4285F4                                                            |
| COLOR_SECONDARY    | #1a73e8                                                            |
| HEADLINE_ROLLING   | TRUE                                                               |
| HEADLINE_LABEL     | headline                                                           |
| FOOTER_TEXT        | © 2025 Sarjana - All Rights Reserved                               |

### 2. Sheet: `Live Website`

Struktur kolom:

| Judul | Label | Gambar | Body | Slug | Meta Deskripsi | Status View | Tgl/Jam | Type |
|-------|-------|--------|------|------|----------------|-------------|---------|------|
| ...   | ...   | ...    | ...  | ...  | ...            | ...         | ...     | ...  |

Slug akan digunakan untuk akses berita seperti: `berita/slug` (tanpa `.html`)

---

## File Website
Berikut file utama yang wajib tersedia:

### ✅ `index.html`
- Menampilkan:
  - Logo dan nama situs
  - Menu dan submenu
  - Headline rolling (jika aktif di config)
  - 1 kolom berita utama
  - Widget kiri, kanan, dan 3 widget biru bawah
- Konten otomatis dari Spreadsheet `Live Website`

### ✅ `berita.html`
- Menampilkan berita berdasarkan parameter `slug` di URL
- Mengambil data dari Spreadsheet tab `Live Website`

### ✅ `style.css`
- Tema bersih dan elegan
- Warna dinamis dari config
- Responsif
- Struktur layout mirip Detik.com

### ✅ `script.js`
- Mengambil semua data config dan konten
- Menyusun menu, logo, headline, widget, dan daftar berita
- Menyusun detail berita berdasarkan `slug`
- Routing otomatis tanpa `.html` di akhir

---

## Deployment
1. Upload semua file (`index.html`, `berita.html`, `style.css`, `script.js`, `README.md`) ke GitHub repo.
2. Hubungkan ke Netlify atau Vercel untuk live hosting gratis.

---

## Catatan
- Pastikan spreadsheet Anda disetel publik (akses baca semua orang)
- Pastikan slug tidak menggunakan spasi, gunakan tanda `-` atau `_`
- Semua pengaturan bisa dimodifikasi langsung via `Config`

---

Berikutnya, seluruh file (`index.html`, `berita.html`, `style.css`, `script.js`) akan saya lanjutkan secara bertahap dengan isi lengkap.
