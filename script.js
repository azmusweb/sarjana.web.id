async function fetchConfig() {
  const res = await fetchData({ sheet: 'Config' });
  const rows = res?.data || [];
  const config = {};
  rows.forEach(row => {
    const key = row[0]?.toString().trim();
    const value = row[1]?.toString().trim();
    if (key) config[key] = value;
  });

  // parsing menu jadi array objek [{name, link}, ...]
  if (config.menu) {
    config.menu = config.menu.split(',').map(item => {
      const [name, link] = item.split(':').map(s => s.trim());
      return { name, link };
    });
  } else {
    config.menu = [];
  }
  return config;
}
