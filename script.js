<script src="script-utility.js"></script>
<script src="script-search-filter.js"></script>
<script>
  const sheetId = "1oMHeKOF2_D6deuV8T1l10_GB0wgsPGLV7WrPcJ6Qxww";
  const apiKey = "AIzaSyCaI7qUmiyzqkZG6KLDifcfMGQ_jqcWyxs";
  const configSheet = 'CONFIG';
  const contentSheet = 'KONTEN';

  async function inisialisasi() {
    const config = await ambilSheet(configSheet);
    const konten = await ambilSheet(contentSheet);

    const dataConfig = {};
    config.forEach(([fungsi, isi]) => dataConfig[fungsi] = isi);

    document.body.style.backgroundColor = dataConfig['warna_dasar'] || '#f5f5f5';
    document.getElementById('logo').src = dataConfig['logo'];
    const menuArray = dataConfig['menu'].split(';');
    buatMenu(menuArray);
    tampilkanSidebar(dataConfig['iklan_sidebar'] || '');
    tampilkanFooter(dataConfig['footer_teks'] || '');

    tampilkanPencarianDanFilter(konten);
  }

  inisialisasi();
</script>
