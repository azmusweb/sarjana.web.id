export default function Navbar({ config }) {
  const menu = (config['menu-navigasi'] || '').split(',').map(m => m.split('|'));
  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex">
        {menu.map(([name, slug]) => (
          <a key={slug} href={`/${slug}`} className="px-4 py-2 hover:bg-gray-700">{name}</a>
        ))}
      </div>
    </nav>
  );
}