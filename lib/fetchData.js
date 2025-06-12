// lib/fetchData.js
export async function fetchKampusData() {
  const sheetId = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
  const sheetName = "DataKampus";
  const apiKey = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?alt=json&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  const [header, ...rows] = data.values;
  return rows.map(row => {
    const obj = {};
    header.forEach((key, index) => {
      obj[key] = row[index] || "";
    });
    return obj;
  });
}
