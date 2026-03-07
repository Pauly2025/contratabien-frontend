import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cv/applications');
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: applications.length,
    enProceso: applications.filter(a => a.status === 'analyzed').length,
    completados: applications.filter(a => a.ai_score >= 80).length
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Gestiona tus procesos de reclutamiento</p>
          </div>
          <Link href="/upload" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 font-semibold">
            + Analizar Nuevo CV
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-teal-600">{stats.total}</div>
            <div className="text-gray-600">Candidatos Totales</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.enProceso}</div>
            <div className="text-gray-600">En Análisis</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.completados}</div>
            <div className="text-gray-600">Alta Puntuación (80+)</div>
          </div>
        </div>

        {/* Lista de aplicaciones */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Candidatos Recientes</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando...</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay candidatos aún. 
              <Link href="/upload" className="text-teal-600 hover:underline ml-1">
                Analiza tu primer CV
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr 
                      key={app.id} 
                      onClick={() => router.push(`/candidate/${app.id}`)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{app.full_name}</div>
                        <div className="text-sm text-gray-500">{app.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{app.job_title}</td>
                      <td className="px-6 py-4">
                        <span className={`text-lg font-bold ${
                          app.ai_score >= 80 ? 'text-green-600' :
                          app.ai_score >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {app.ai_score || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(app.created_at).toLocaleDateString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}