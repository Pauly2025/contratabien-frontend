import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function CandidateDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cv/application/${id}`);
      const data = await response.json();
      setApplication(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Cargando...</div>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Candidato no encontrado</p>
          <Link href="/dashboard" className="text-teal-600 hover:underline">
            Volver al Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  const analysis = application.ai_analysis;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard" className="text-teal-600 hover:underline mb-4 inline-block">
            ← Volver al Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{application.full_name}</h1>
              <p className="text-gray-600">{application.email}</p>
              <p className="text-sm text-gray-500 mt-1">Aplicó para: {application.job_title}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-teal-600">
                {application.ai_score}/100
              </div>
              <div className="text-sm text-gray-500">Puntuación IA</div>
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-700">Estado Actual</h3>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                {application.status}
              </span>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Fecha de aplicación:</p>
              <p className="font-semibold">{new Date(application.created_at).toLocaleDateString('es-CL')}</p>
            </div>
          </div>
        </div>

        {/* Análisis de IA */}
        {analysis && (
          <div className="space-y-6">
            {/* Fortalezas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-green-700 mb-3 flex items-center text-lg">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Fortalezas Identificadas
              </h3>
              <ul className="space-y-2">
                {analysis.fortalezas?.map((f, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Debilidades */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-orange-700 mb-3 flex items-center text-lg">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                Áreas de Mejora
              </h3>
              <ul className="space-y-2">
                {analysis.debilidades?.map((d, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-orange-500 mr-2">⚠</span>
                    <span className="text-gray-700">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Competencias */}
            {analysis.competencias_clave && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-blue-700 mb-4 text-lg">Competencias Clave</h3>
                
                {analysis.competencias_clave.tecnicas?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Técnicas:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.competencias_clave.tecnicas.map((c, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.competencias_clave.blandas?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Blandas:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.competencias_clave.blandas.map((c, i) => (
                        <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experiencia Relevante */}
            {analysis.experiencia_relevante && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-700 mb-3 text-lg">Experiencia Relevante</h3>
                <p className="text-gray-700">{analysis.experiencia_relevante}</p>
              </div>
            )}

            {/* Recomendación */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg shadow p-6 border-l-4 border-teal-600">
              <h3 className="font-semibold text-teal-900 mb-2 text-lg">Recomendación Final</h3>
              <p className="text-teal-800 text-lg">{analysis.recomendacion}</p>
            </div>

            {/* Acciones */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Acciones</h3>
              <div className="flex gap-3">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                  ✓ Aprobar
                </button>
                <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700">
                  → Siguiente Etapa
                </button>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                  ✗ Rechazar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}