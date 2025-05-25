import Link from "next/link";

type Props = { config: Record<string, string> };

export default function Header({ config }: Props) {
  const logo = config["link-logo-gambar-website"] || "";
  const logoText = config["logo-hanya-text"] || "SARJANA";
  const menus = (config["menu-navigasi"] || "")
    .split(",")
    .map(m => {
      const [name, slug] = m.split("|");
      return { name, slug };
    });

  return (
    <header>
      <div className="logo">
        {logo ? <img src={logo} alt={logoText} height={40} /> : <span>{logoText}</span>}
      </div>
      <nav>
        {menus.map(menu =>
          <Link key={menu.slug} href={`/${menu.slug}`}>{menu.name}</Link>
        )}
      </nav>
      <style jsx>{`
        header { display: flex; align-items: center; padding: 12px 24px; background: var(--warna-background-navigasi);}
        .logo { margin-right: 36px; }
        nav a { margin-right: 24px; font-weight: 500; color: var(--warna-link-menu-navigasi);}
      `}</style>
    </header>
  );
}