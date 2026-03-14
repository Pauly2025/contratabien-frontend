import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/profiles`);
      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Perfiles de Cargo</h1>
            <p className="text-gray-600">Define los requisitos y criterios para cada posición</p>
          </div>
          <Link href="/profiles/new" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 font-semibold">
            + Crear Perfil
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Cargando perfiles...</div>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 mb-4">No hay perfiles creados aún</p>
            <Link href="/profiles/new" className="text-teal-600 hover:underline">
              Crear tu primer perfil
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{profile.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{profile.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Must-have:</span>
                    <span className="text-gray-700 font-medium">
                      {profile.must_have_skills?.length || 0} skills
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Nice-to-have:</span>
                    <span className="text-gray-700 font-medium">
                      {profile.nice_to_have_skills?.length || 0} skills
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-24">Experiencia:</span>
                    <span className="text-gray-700 font-medium">
                      {profile.years_experience_min}+ años
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 flex gap-2">
                  <Link 
                    href={`/profiles/${profile.id}`}
                    className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 text-sm font-medium"
                  >
                    Ver detalles
                  </Link>
                  <Link 
                    href={`/profiles/${profile.id}/edit`}
                    className="flex-1 text-center bg-teal-100 text-teal-700 px-4 py-2 rounded hover:bg-teal-200 text-sm font-medium"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}