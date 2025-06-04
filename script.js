const spreadsheetId = '1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww';
const sheetName = 'Live Website';
const apiKey = 'AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs';

const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?alt=json&key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const rows = data.values;
    const headers = rows[0];
    const beritaList = rows.slice(1);
    const container = document.getElementById('berita-list');

    beritaList.forEach(row => {
      const data = {};
      headers.forEach((h, i) => data[h] = row[i]);

      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img src="${data['Gambar'] || ''}" alt="${data['Judul']}" />
        <h2><a href="berita.html?slug=${data['Slug']}" style="text-decoration:none;color:#1e88e5;">${data['Judul']}</a></h2>
        <p>${data['Body']?.substring(0, 100) || ''}...</p>
      `;

      container.appendChild(card);
    });
  });
