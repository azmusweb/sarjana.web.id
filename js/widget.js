fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Widget?key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const rows = data.values;
    let html = '';
    for (let i = 1; i < rows.length; i++) {
      const [judul, isi] = rows[i];
      html += `<div class="widget"><h3>${judul}</h3><div>${isi}</div></div>`;
    }
    document.getElementById('widget').innerHTML = html;
  });
