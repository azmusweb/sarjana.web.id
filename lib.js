import axios from "axios";

export async function fetchSheet(sheetName = "live") {
  const spreadsheetId = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
  const apiKey = "AIzaSyDKOClQy1z23Hwjr9HyHmzJbuaPE9Ccbv4";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?alt=json&key=${apiKey}`;

  const res = await axios.get(url);
  const [header, ...rows] = res.data.values;
  return rows.map((row) =>
    Object.fromEntries(header.map((h, i) => [h, row[i] || ""]))
  );
}
