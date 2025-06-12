fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Konten?key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const rows = data.values;
    let html = '';
    for (let i = 1; i < rows.length; i++) {
      const [judul, deskripsi, gambar, link] = rows[i];
      html += `
        <article>
          <img src="${gambar}" alt="${judul}" />
          <h2><a href="${link}">${judul}</a></h2>
          <p>${deskripsi}</p>
        </article>
      `;
    }
    document.getElementById('konten').innerHTML = html;
  });
