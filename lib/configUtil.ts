import { fetchSheet } from "./googleSheet";

export async function getConfig() {
  const configRows = await fetchSheet("CONFIG");
  const config: Record<string, string> = {};
  configRows.forEach(row => {
    config[row.FUNGSI] = row.WEBSITE;
  });
  return config;
}