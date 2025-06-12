// Konfigurasi
const sheetId = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
const apiKey = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";
const sheetName = "Kampus"; // Nama Sheet

// Load nav dan widget
fetch('nav.html').then(res => res.text()).then(html => {
  document.getElementById('nav-container').innerHTML = html;
});

fetch('widget.html').then(res => res.text()).then(html => {
  document.getElementById('widget-container').innerHTML = html;
});

// Ambil data kampus
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const rows = data.values;
    const headers = rows[0];
    const content = rows.slice(1);

    const kampusList = document.getElementById("kampus-list");
    kampusList.innerHTML = "";

    content.forEach(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i] || "");
      kampusList.innerHTML += `
        <div class="kampus-item">
          <h2>${obj['Nama Kampus']}</h2>
          <p><strong>Lokasi:</strong> ${obj['Lokasi']}</p>
          <p><strong>Akreditasi:</strong> ${obj['Akreditasi']}</p>
          <p>${obj['Deskripsi']}</p>
          <a href="${obj['Website']}" target="_blank">Kunjungi Situs</a>
        </div>
      `;
    });
  })
  .catch(err => {
    document.getElementById("kampus-list").innerText = "Gagal memuat data.";
    console.error(err);
  });
