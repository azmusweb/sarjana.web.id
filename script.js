async function loadKonten() {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Konten?key=${API_KEY}`);
  const data = await res.json();
  const rows = data.values;

  let kontenHTML = "";
  for (let i = 1; i < rows.length; i++) {
    let [judul, deskripsi, gambar, link] = rows[i];
    kontenHTML += `
      <article>
        <h2>${judul}</h2>
        <img src="${gambar}" alt="${judul}" width="100%">
        <p>${deskripsi}</p>
        <a href="${link}" target="_blank">Lihat Selengkapnya</a>
      </article>
    `;
  }

  document.getElementById("konten-dinamis").innerHTML = kontenHTML;
}

loadKonten();
