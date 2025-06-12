async function loadWidgets() {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Widget?key=${API_KEY}`);
  const data = await res.json();
  const rows = data.values;

  let widgetHTML = '<div class="widgets">';
  for (let i = 1; i < rows.length; i++) {
    let [judul, isi] = rows[i];
    widgetHTML += `<div class="widget"><h4>${judul}</h4><p>${isi}</p></div>`;
  }
  widgetHTML += '</div>';
  document.getElementById("sidebar-widgets").innerHTML = widgetHTML;
}

loadWidgets();
