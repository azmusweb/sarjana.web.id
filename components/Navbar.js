export default function Navbar({ config }) {
  const daftarMenu = (config["menu-navigasi"] || "")
    .split(",")
    .map(m => m.split("|"));
  return (
    <nav className="flex bg-gray-800 text-white">
      {daftarMenu.map(([nama, slug]) => (
        <a href={`/${slug}`} key={slug} className="px-4 py-2 hover:bg-gray-700">{nama}</a>
      ))}
    </nav>
  );
}