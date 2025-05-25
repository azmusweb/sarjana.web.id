export default function Footer({ config }) {
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>Widget 1</div>
        <div>Widget 2</div>
        <div>Widget 3</div>
      </div>
      <div className="text-center py-4 text-sm border-t border-gray-700">
        {config['copyright-credit'] || "© SARJANA"}
      </div>
    </footer>
  );
}