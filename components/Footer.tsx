type Props = { config: Record<string, string> };

export default function Footer({ config }: Props) {
  return (
    <footer>
      <div>
        <h4>Tentang</h4>
        <p>{config["meta-deskripsi-home"]}</p>
      </div>
      <div>
        <h4>Kontak</h4>
        <p>Email: {config["contact-us-email"]}</p>
        <p>Admin: {config["nama-admin"]}</p>
      </div>
      <div>
        <h4>Sosial Media</h4>
        {/* Tambah dari config jika ada */}
      </div>
      <div className="copyright">{config["copyright-credit"]}</div>
      <style jsx>{`
        footer { background: var(--warna-backround-footer, #222); color: var(--warna-text-footer, #888); padding: 24px 0; display: flex; justify-content: space-between;}
        .copyright { width: 100%; text-align: center; margin-top: 18px; font-size: 0.95em; }
      `}</style>
    </footer>
  );
}