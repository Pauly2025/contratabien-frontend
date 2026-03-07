import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cv/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Cargando estadísticas...</div>
      </Layout>
    );
  }

  const { stats: generalStats, activity } = stats || {};

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Estadísticas del Sistema</h1>

        {/* Stats Generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{generalStats?.total_candidatos || 0}</div>
            <div className="text-gray-600 text-sm">Total Candidatos</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{generalStats?.alta_calidad || 0}</div>
            <div className="text-gray-600 text-sm">Alta Calidad (80+)</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{generalStats?.media_calidad || 0}</div>
            <div className="text-gray-600 text-sm">Media Calidad (60-79)</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-teal-600">{generalStats?.promedio_score || 0}</div>
            <div className="text-gray-600 text-sm">Score Promedio</div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actividad de los Últimos 30 Días</h2>
          {activity && activity.length > 0 ? (
            <div className="space-y-2">
              {activity.map((day, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-gray-700">
                    {new Date(day.fecha).toLocaleDateString('es-CL', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="font-semibold text-teal-600">{day.cantidad} candidatos</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay actividad registrada aún</p>
          )}
        </div>
      </div>
    </Layout>
  );
}