// home-section.js
// Loader untuk slider & breaking news dari sheet 'Home Section'

ambilSheet('Home Section').then(rows => {
  const section = document.getElementById('home-section');
  if (!section) return;

  const headers = rows[0];
  const entries = rows.slice(1).map(row => Object.fromEntries(row.map((val, i) => [headers[i], val])));

  let sliderHTML = '<div class="slider">';
  let breakingHTML = '<div class="breaking-news"><strong>Breaking:</strong> ';

  entries.forEach(entry => {
    if (entry.Type === 'Slider') {
      sliderHTML += `
        <div class="slide">
          <a href="berita.html?slug=${entry.Slug}">
            <img src="${entry.Gambar}" alt="${entry.Judul}">
            <h3>${entry.Judul}</h3>
          </a>
        </div>`;
    } else if (entry.Type === 'Breaking') {
      breakingHTML += `<a href="berita.html?slug=${entry.Slug}">${entry.Judul}</a> &nbsp;|&nbsp; `;
    }
  });

  sliderHTML += '</div>';
  breakingHTML += '</div>';

  section.innerHTML = breakingHTML + sliderHTML;
});
