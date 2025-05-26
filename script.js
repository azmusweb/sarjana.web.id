async function loadBerita() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${CONFIG.SHEET_NAME}?key=${CONFIG.API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const rows = data.values.slice(1);

  const path = window.location.pathname;
  if (path.includes("index")) {
    document.getElementById("berita-list").innerHTML = rows.map(row => `
      <article>
        <h2><a href="berita.html?slug=${row[4]}">${row[0]}</a></h2>
        <p>${row[3].substring(0, 100)}...</p>
      </article>
    `).join("");
  } else if (path.includes("berita")) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const berita = rows.find(row => row[4] === slug);
    if (berita) {
      document.getElementById("berita-detail").innerHTML = `
        <h2>${berita[0]}</h2>
        <img src="${berita[2]}" alt="">
        <p>${berita[3]}</p>
        <p><small>${berita[7]}</small></p>
      `;
    } else {
      document.getElementById("berita-detail").textContent = "Berita tidak ditemukan.";
    }
  }
}

window.addEventListener("DOMContentLoaded", loadBerita);
