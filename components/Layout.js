import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold">
              Contratabien AI
            </Link>
            <div className="flex gap-4">
              <Link href="/dashboard" className="hover:text-teal-200">
                Dashboard
              </Link>
              <Link href="/upload" className="hover:text-teal-200">
                Analizar CV
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>© 2026 Contratabien AI - Reclutamiento Inteligente</p>
        </div>
    <div className="flex gap-4">
  <Link href="/dashboard" className="hover:text-teal-200">
    Dashboard
  </Link>
  <Link href="/profiles" className="hover:text-teal-200">
    Perfiles
  </Link>
  <Link href="/upload" className="hover:text-teal-200">
    Analizar CV
  </Link>
  <Link href="/stats" className="hover:text-teal-200">
    Estadísticas
  </Link>
</div>
      </footer>
    </div>
  );
}
