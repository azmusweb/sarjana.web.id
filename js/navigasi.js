fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Navigasi?key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const rows = data.values;
    let html = '<ul>';
    for (let i = 1; i < rows.length; i++) {
      const [label, link] = rows[i];
      html += `<li><a href="${link}">${label}</a></li>`;
    }
    html += '</ul>';
    document.getElementById('navigasi').innerHTML = html;
  });
