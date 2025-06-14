// sidebar.js
// Loader untuk sidebar dari sheet 'Sidebar'

ambilSheet('Sidebar').then(rows => {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const headers = rows[0];
  const data = rows.slice(1).map(row => Object.fromEntries(row.map((val, i) => [headers[i], val])));

  let html = '';

  // Kategorikan berdasarkan tipe
  const populer = data.filter(x => x.Type === 'Populer');
  const label = data.filter(x => x.Type === 'Label');
  const custom = data.filter(x => x.Type === 'Custom');

  if (populer.length > 0) {
    html += '<h3>Berita Populer</h3><ul>';
    populer.forEach(item => {
      html += `<li><a href="berita.html?slug=${item.Slug}">${item.Judul}</a></li>`;
    });
    html += '</ul>';
  }

  if (label.length > 0) {
    html += '<h3>Label</h3><ul>';
    label.forEach(item => {
      html += `<li><a href="index.html?label=${item.Label}">${item.Label}</a></li>`;
    });
    html += '</ul>';
  }

  if (custom.length > 0) {
    html += '<div class="custom-widget">';
    custom.forEach(item => {
      html += item.HTML;
    });
    html += '</div>';
  }

  sidebar.innerHTML = html;
});
