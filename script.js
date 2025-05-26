// Render logo atau nama situs sesuai config
function renderLogoAndName(config) {
  const logoEl = document.getElementById('site-logo');
  const nameEl = document.getElementById('site-name');
  const logoLink = document.getElementById('logo-link');

  if (config['SITE_LOGO'] && config['SITE_LOGO'].trim() !== '') {
    logoEl.src = config['SITE_LOGO'].trim();
    logoEl.style.display = 'inline-block';
    nameEl.style.display = 'none';
  } else {
    nameEl.textContent = config['SITE_NAME'] || 'Website';
    nameEl.style.display = 'inline-block';
    logoEl.style.display = 'none';
  }

  logoLink.href = '/';
}

// Parsing dan render menu navigasi dari config['menu-navigasi']
function parseAndRenderMenu(menuString) {
  const menuContainer = document.getElementById('menu-container');
  menuContainer.innerHTML = '';

  if (!menuString) return;

  const menus = menuString.split(',');
  menus.forEach(item => {
    item = item.trim();
    if (!item) return;

    const parts = item.split('|').map(s => s.trim());
    let titlePart = parts[0];
    const url = parts[1] || '#';

    // Cek submenu (dalam tanda kurung)
    let submenu = [];
    const submenuMatch = titlePart.match(/\(([^)]+)\)/);
    if (submenuMatch) {
      submenu = submenuMatch[1].split('|').map(s => s.trim());
      titlePart = titlePart.replace(/\(([^)]+)\)/, '').trim();
    }

    // Cek menu spesial (diawali *)
    let isSpecial = false;
    if (titlePart.startsWith('*')) {
      isSpecial = true;
      titlePart = titlePart.substring(1);
    }

    const li = document.createElement('li');
    li.classList.add('menu-item');
    if (submenu.length > 0) li.classList.add('has-submenu');
    if (isSpecial) li.classList.add('special-menu');

    const a = document.createElement('a');
    a.href = url;
    a.textContent = titlePart;
    li.appendChild(a);

    if (submenu.length > 0) {
      const ulSub = document.createElement('ul');
      ulSub.classList.add('submenu');

      submenu.forEach(sub => {
        const liSub = document.createElement('li');
        const aSub = document.createElement('a');
        // Submenu link: url + sub + /
        aSub.href = url.endsWith('/') ? url + sub + '/' : url + '/' + sub + '/';
        aSub.textContent = sub;
        liSub.appendChild(aSub);
        ulSub.appendChild(liSub);
      });

      li.appendChild(ulSub);
    }

    menuContainer.appendChild(li);
  });
}

// Fungsi inisialisasi menu dan logo sekaligus dari config
function initNavigation(config) {
  renderLogoAndName(config);
  parseAndRenderMenu(config['menu-navigasi']);
}

// Optional: Jika ingin support toggle submenu di mobile, bisa ditambahkan di sini.
// Misalnya:
// document.addEventListener('click', function(e) {
//   if (e.target.matches('.has-submenu > a')) {
//     e.preventDefault();
//     e.target.parentElement.classList.toggle('submenu-open');
//   }
// });
