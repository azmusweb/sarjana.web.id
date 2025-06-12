const API_KEY = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";
const SHEET_ID = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";

async function loadNav() {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Navigasi?key=${API_KEY}`);
  const data = await res.json();
  const rows = data.values;
  
  let navHTML = '<ul>';
  for (let i = 1; i < rows.length; i++) {
    let [label, link] = rows[i];
    navHTML += `<li><a href="${link}">${label}</a></li>`;
  }
  navHTML += '</ul>';
  document.getElementById("main-nav").innerHTML = navHTML;
}

loadNav();
