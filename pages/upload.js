import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Upload() {
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState({
    jobPostingId: '1',
    profileId: '',
    candidateName: '',
    candidateEmail: '',
    cvFile: null
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/profiles`);
      const data = await response.json();
      setProfiles(data.profiles || []);
      
      // Seleccionar primer perfil por defecto
      if (data.profiles?.length > 0) {
        setFormData(prev => ({ ...prev, profileId: data.profiles[0].id.toString() }));
      }
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo es muy grande. Máximo 10MB.');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de archivo no soportado. Usa PDF, DOCX, TXT o imágenes.');
      return;
    }

    setFormData({ ...formData, cvFile: file });
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (!formData.cvFile) {
      setError('Debes subir un archivo CV');
      setLoading(false);
      return;
    }

    if (!formData.profileId) {
      setError('Debes seleccionar un perfil de cargo');
      setLoading(false);
      return;
    }
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('jobPostingId', formData.profileId); // Usar profileId como jobPostingId
      formDataToSend.append('candidateName', formData.candidateName);
      formDataToSend.append('candidateEmail', formData.candidateEmail);
      formDataToSend.append('cvFile', formData.cvFile);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/cv/analyze`, {
        method: 'POST',
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Error al procesar');
      }
      
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const selectedProfile = profiles.find(p => p.id.toString() === formData.profileId);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analizar CV con IA</h1>
        <p className="text-gray-600 mb-6">Sube el CV de un candidato y obtén un análisis multidimensional automático</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Subir CV</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Selección de Perfil */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Perfil de Cargo *</label>
                <select
                  required
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                  value={formData.profileId}
                  onChange={(e) => setFormData({...formData, profileId: e.target.value})}
                >
                  <option value="">Selecciona un perfil...</option>
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.title}
                    </option>
                  ))}
                </select>
                
                {selectedProfile && (
                  <div className="mt-2 p-3 bg-teal-50 rounded text-sm">
                    <p className="text-teal-900 font-medium">Requisitos del perfil:</p>
                    <p className="text-teal-700">
                      • {selectedProfile.must_have_skills?.length || 0} skills obligatorios
                    </p>
                    <p className="text-teal-700">
                      • {selectedProfile.years_experience_min}+ años de experiencia
                    </p>
                  </div>
                )}
              </div>

              {/* Drag & Drop Zone */}
              <div 
                className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center transition ${
                  isDragging 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-300 hover:border-teal-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {formData.cvFile ? (
                  <div className="space-y-2">
                    <svg className="w-12 h-12 mx-auto text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="font-medium text-gray-900">{formData.cvFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(formData.cvFile.size)}</p>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cvFile: null })}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-700 font-medium mb-1">Arrastra el CV aquí</p>
                    <p className="text-sm text-gray-500 mb-3">o</p>
                    <label className="cursor-pointer bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 inline-block">
                      Seleccionar archivo
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-3">
                      PDF, DOCX, TXT, JPG, PNG (máx. 10MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nombre Completo (opcional)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={formData.candidateName}
                  onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                  placeholder="Se extraerá automáticamente del CV"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email (opcional)</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={formData.candidateEmail}
                  onChange={(e) => setFormData({...formData, candidateEmail: e.target.value})}
                  placeholder="Se extraerá automáticamente del CV"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.cvFile || !formData.profileId}
                className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Analizando con IA multidimensional...
                  </span>
                ) : 'Analizar CV con IA'}
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
              <div className="bg-white p-6 rounded-lg shadow space-y-6">
                <h2 className="text-xl font-semibold">Análisis Multidimensional</h2>
                
                {/* Score Final */}
                <div className="text-center p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                  <div className="text-5xl font-bold text-teal-600 mb-2">
                    {result.analysis.score_final || result.analysis.score}<span className="text-2xl">/100</span>
                  </div>
                  <div className="text-sm text-gray-600">Score Final Ponderado</div>
                  {result.analysis.profile_used && (
                    <div className="mt-2 text-xs text-gray-500">
                      Evaluado con: {result.analysis.profile_used.title}
                    </div>
                  )}
                </div>

                {/* Análisis por Dimensiones */}
                {result.analysis.competencias_tecnicas && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Desglose por Dimensión</h3>
                    
                    {/* Competencias Técnicas */}
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-blue-900">Competencias Técnicas</h4>
                        <span className="text-2xl font-bold text-blue-600">
                          {result.analysis.competencias_tecnicas.score}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {result.analysis.competencias_tecnicas.justificacion}
                      </p>
                      {result.analysis.competencias_tecnicas.tiene?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          <span className="text-xs text-gray-600">Tiene:</span>
                          {result.analysis.competencias_tecnicas.tiene.map((s, i) => (
                            <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {result.analysis.competencias_tecnicas.falta?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-gray-600">Falta:</span>
                          {result.analysis.competencias_tecnicas.falta.map((s, i) => (
                            <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Experiencia */}
                    {result.analysis.experiencia && (
                      <div className="border-l-4 border-purple-500 pl-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-purple-900">Experiencia</h4>
                          <span className="text-2xl font-bold text-purple-600">
                            {result.analysis.experiencia.score}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {result.analysis.experiencia.justificacion}
                        </p>
                        <div className="text-xs text-gray-600 mt-1">
                          {result.analysis.experiencia.años_totales} años total • {result.analysis.experiencia.años_relevantes} relevantes
                        </div>
                      </div>
                    )}

                    {/* Ajuste Cultural */}
                    {result.analysis.ajuste_cultural && (
                      <div className="border-l-4 border-teal-500 pl-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-teal-900">Ajuste Cultural</h4>
                          <span className="text-2xl font-bold text-teal-600">
                            {result.analysis.ajuste_cultural.score}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {result.analysis.ajuste_cultural.justificacion}
                        </p>
                      </div>
                    )}

                    {/* Potencial */}
                    {result.analysis.potencial && (
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-yellow-900">Potencial de Crecimiento</h4>
                          <span className="text-2xl font-bold text-yellow-600">
                            {result.analysis.potencial.score}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {result.analysis.potencial.justificacion}
                        </p>
                      </div>
                    )}

                    {/* Educación */}
                    {result.analysis.educacion && (
                      <div className="border-l-4 border-indigo-500 pl-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-indigo-900">Educación</h4>
                          <span className="text-2xl font-bold text-indigo-600">
                            {result.analysis.educacion.score}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {result.analysis.educacion.justificacion}
                        </p>
                      </div>
                    )}

                    {/* Red Flags */}
                    {result.analysis.red_flags && (
                      <div className="border-l-4 border-red-500 pl-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-red-900">Señales de Alerta</h4>
                          <span className="text-2xl font-bold text-red-600">
                            {result.analysis.red_flags.score}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {result.analysis.red_flags.justificacion}
                        </p>
                        {result.analysis.red_flags.severidad && (
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              result.analysis.red_flags.severidad === 'alta' ? 'bg-red-100 text-red-700' :
                              result.analysis.red_flags.severidad === 'media' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              Severidad: {result.analysis.red_flags.severidad}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Fortalezas Únicas */}
                {result.analysis.fortalezas_unicas && result.analysis.fortalezas_unicas.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-700 mb-2">✨ Fortalezas Únicas</h3>
                    <ul className="space-y-1">
                      {result.analysis.fortalezas_unicas.map((f, i) => (
                        <li key={i} className="text-sm text-gray-700 pl-4">• {f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Áreas de Desarrollo */}
                {result.analysis.areas_desarrollo && result.analysis.areas_desarrollo.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-2">📈 Áreas de Desarrollo</h3>
                    <ul className="space-y-1">
                      {result.analysis.areas_desarrollo.map((a, i) => (
                        <li key={i} className="text-sm text-gray-700 pl-4">• {a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recomendación */}
                <div className="p-4 bg-teal-50 border-l-4 border-teal-600 rounded">
                  <h3 className="font-semibold text-teal-900 mb-1">🎯 Recomendación</h3>
                  <p className="text-sm text-teal-800">{result.analysis.recomendacion}</p>
                </div>

                {/* Feedback para Candidato */}
                {result.analysis.feedback_candidato && (
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                    <h3 className="font-semibold text-blue-900 mb-1">💬 Feedback Constructivo</h3>
                    <p className="text-sm text-blue-800">{result.analysis.feedback_candidato}</p>
                  </div>
                )}
              </div>
            )}

            {!result && !loading && (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>Sube un CV para ver el análisis multidimensional completo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}