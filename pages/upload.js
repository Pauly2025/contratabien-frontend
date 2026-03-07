import { useState } from 'react';
import Layout from '../components/Layout';

export default function Upload() {
  const [formData, setFormData] = useState({
    jobPostingId: '1',
    candidateName: '',
    candidateEmail: '',
    cvText: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar');
      }
      
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analizar CV con IA</h1>
        <p className="text-gray-600 mb-6">Sube el CV de un candidato y obtén un análisis automático</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Datos del Candidato</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={formData.candidateName}
                  onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={formData.candidateEmail}
                  onChange={(e) => setFormData({...formData, candidateEmail: e.target.value})}
                  placeholder="juan@email.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">CV (Texto)</label>
                <textarea
                  className="w-full border border-gray-300 p-2 rounded h-48 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={formData.cvText}
                  onChange={(e) => setFormData({...formData, cvText: e.target.value})}
                  placeholder="Pega aquí el contenido del CV o escribe la experiencia del candidato..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Incluye nombre, contacto, experiencia, educación y habilidades
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Analizando con IA...
                  </span>
                ) : 'Analizar CV'}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {/* Resultado */}
          <div>
            {result && result.success && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Resultado del Análisis</h2>
                
                {/* Score */}
                <div className="mb-6 text-center p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                  <div className="text-5xl font-bold text-teal-600 mb-2">
                    {result.analysis.score}<span className="text-2xl">/100</span>
                  </div>
                  <div className="text-sm text-gray-600">Puntuación General</div>
                </div>

                {/* Fortalezas */}
                <div className="mb-4">
                  <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Fortalezas
                  </h3>
                  <ul className="space-y-1">
                    {result.analysis.fortalezas.map((f, i) => (
                      <li key={i} className="text-sm text-gray-700 pl-7">• {f}</li>
                    ))}
                  </ul>
                </div>

                {/* Debilidades */}
                <div className="mb-4">
                  <h3 className="font-semibold text-orange-700 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Áreas de Mejora
                  </h3>
                  <ul className="space-y-1">
                    {result.analysis.debilidades.map((d, i) => (
                      <li key={i} className="text-sm text-gray-700 pl-7">• {d}</li>
                    ))}
                  </ul>
                </div>

                {/* Competencias */}
                {result.analysis.competencias_clave && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-blue-700 mb-2">Competencias Clave</h3>
                    <div className="space-y-2">
                      {result.analysis.competencias_clave.tecnicas?.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Técnicas:</p>
                          <div className="flex flex-wrap gap-1">
                            {result.analysis.competencias_clave.tecnicas.map((c, i) => (
                              <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.analysis.competencias_clave.blandas?.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Blandas:</p>
                          <div className="flex flex-wrap gap-1">
                            {result.analysis.competencias_clave.blandas.map((c, i) => (
                              <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recomendación */}
                <div className="mt-6 p-4 bg-teal-50 border-l-4 border-teal-600 rounded">
                  <h3 className="font-semibold text-teal-900 mb-1">Recomendación</h3>
                  <p className="text-sm text-teal-800">{result.analysis.recomendacion}</p>
                </div>

                {/* IDs */}
                <div className="mt-4 text-xs text-gray-500">
                  ID Aplicación: {result.applicationId} | ID Candidato: {result.candidateId}
                </div>
              </div>
            )}

            {!result && !loading && (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Completa el formulario y envía un CV para ver el análisis aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}