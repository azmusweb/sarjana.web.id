import Navbar from './Navbar'

export default function Header({ config }) {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex items-center py-2">
        {config['link-logo-gambar-website'] ? (
          <img src={config['link-logo-gambar-website']} alt="Logo" className="h-12 mr-2" />
        ) : (
          <span className="text-2xl font-bold">{config['logo-hanya-text'] || 'SARJANA'}</span>
        )}
        <span className="ml-4 text-gray-600">{config['slogan-admin']}</span>
      </div>
      <Navbar config={config} />
    </header>
  )
}