// KONFIGURASI SPREADSHEET
const sheetId = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const apiKey = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";

// LOAD NAVIGASI DAN WIDGET
document.addEventListener("DOMContentLoaded", () => {
  includeHTML("nav.html", "nav-container");
  includeHTML("widget.html", "widget-container");
  loadConfig();
  loadKampusList(); // Opsional: jika nanti ingin menampilkan daftar kampus
});

// Fungsi untuk menyisipkan HTML eksternal
function includeHTML(file, containerId) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(containerId).innerHTML = data;
    })
    .catch(err => console.error(`Gagal memuat ${file}:`, err));
}

// FUNGSI MEMUAT CONFIG DARI SPREADSHEET
function loadConfig() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Config?key=${apiKey}`;
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const rows = data.values;
      const config = {};
      rows.forEach(row => {
        const key = row[0]?.trim();
        const value = row[1]?.trim();
        if (key && value) config[key] = value;
      });

      // Terapkan ke elemen halaman
      if (config["Judul Situs"]) {
        document.title = config["Judul Situs"];
        const h1 = document.querySelector("header h1");
        if (h1) h1.innerText = config["Judul Situs"];
      }

      if (config["Logo URL"]) {
        const logo = document.createElement("img");
        logo.src = config["Logo URL"];
        logo.alt = config["Judul Situs"] || "Logo";
        logo.style.maxHeight = "50px";
        const headerH1 = document.querySelector("header h1");
        if (headerH1) {
          headerH1.innerHTML = "";
          headerH1.appendChild(logo);
        }
      }

      if (config["Warna Header"]) {
        const header = document.querySelector("header");
        if (header) header.style.backgroundColor = config["Warna Header"];
      }

      if (config["Warna Dasar"]) {
        document.body.style.backgroundColor = config["Warna Dasar"];
      }

      if (config["Footer Teks"]) {
        const footer = document.querySelector("footer");
        if (footer) footer.innerHTML = config["Footer Teks"];
      }

    })
    .catch(err => console.error("Gagal memuat konfigurasi:", err));
}

// OPSIONAL: MEMUAT DAFTAR KAMPUS (nanti bisa ditampilkan)
function loadKampusList() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Kampus?key=${apiKey}`;
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const rows = data.values;
      const header = rows.shift(); // baris judul
      const container = document.getElementById("konten-kampus");

      if (!container) return;

      rows.forEach(row => {
        const kampus = {};
        header.forEach((h, i) => {
          kampus[h.trim()] = row[i];
        });

        // Buat elemen kampus
        const div = document.createElement("div");
        div.className = "kampus-item";
        div.innerHTML = `
          <h3>${kampus["Nama Kampus"]}</h3>
          <p><strong>Lokasi:</strong> ${kampus["Lokasi"]}</p>
          <p><strong>Akreditasi:</strong> ${kampus["Akreditasi"]}</p>
          <p>${kampus["Deskripsi"]}</p>
          <a href="${kampus["Website"]}" target="_blank">Kunjungi Situs</a>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => console.error("Gagal memuat data kampus:", err));
}
