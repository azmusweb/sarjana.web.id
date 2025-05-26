# Sarjana News Website

Website berita dinamis berbasis Google Spreadsheet sebagai database, dengan konfigurasi penuh dari sheet Config. Tampilan bersih, profesional, dan responsif seperti detik.com dengan nuansa warna biru elegan.

## Fitur

- Data berita diambil dari Google Sheets (sheet Live Website)
- Konfigurasi menu, widget, warna, headline rolling, dan lain-lain dari sheet Config
- URL clean tanpa `.html` dan `www`
- Detail berita dinamis
- Widget otomatis berdasarkan label berita
- Headline rolling berita utama
- Responsif dan mobile friendly

## Cara Setup

1. Upload semua file ke GitHub Pages atau hosting statis lain.
2. Pastikan spreadsheet Google Sheets:
   - Dibagikan ke publik (Anyone with the link can view)
   - Memiliki sheet Config dan Live Website dengan format benar.
3. Update `script.js` dengan Spreadsheet ID dan API Key kamu.
4. Edit sheet Config untuk mengatur menu, warna, widget, dll.

## Struktur Sheet Config (kolom FUNGSI dan WEBSITE)

| FUNGSI           | WEBSITE                              |
|------------------|------------------------------------|
| SITE_NAME        | Sarjana                            |
| SITE_LOGO        | (URL logo atau kosong)             |
| menu-navigasi    | Home | /, BERITA (news|red) | /berita/, ... |
| WIDGET_LABEL_1   | politik                           |
| WIDGET_LABEL_2   | ekonomi                           |
| WIDGET_LABEL_3   | sport                            |
| COLOR_PRIMARY    | #4285F4                          |
| COLOR_SECONDARY  | #1a73e8                          |
| HEADLINE_ROLLING | TRUE                             |
| HEADLINE_LABEL   | headline                         |
| FOOTER_TEXT      | © 2025 Sarjana - All Rights Reserved |

## Struktur Sheet Live Website (baris pertama header kolom)

| Judul | Label | Gambar | Body | Slug | Meta_Deskripsi | Status_View | Tanggal | Type |

## Lisensi

MIT License
