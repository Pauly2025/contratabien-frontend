import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function NewProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    must_have_skills: '',
    nice_to_have_skills: '',
    deal_breakers: '',
    cultural_values: '',
    weight_technical: 30,
    weight_experience: 25,
    weight_cultural: 20,
    weight_potential: 15,
    weight_education: 10,
    years_experience_min: 0,
    ideal_candidate_example: '',
    anti_patterns: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convertir strings separados por comas a arrays
      const profileData = {
        ...formData,
        must_have_skills: formData.must_have_skills.split(',').map(s => s.trim()).filter(s => s),
        nice_to_have_skills: formData.nice_to_have_skills.split(',').map(s => s.trim()).filter(s => s),
        deal_breakers: formData.deal_breakers.split(',').map(s => s.trim()).filter(s => s),
        cultural_values: formData.cultural_values.split(',').map(s => s.trim()).filter(s => s),
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error creando perfil');
      }

      router.push('/profiles');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalWeight = parseInt(formData.weight_technical) + 
                      parseInt(formData.weight_experience) + 
                      parseInt(formData.weight_cultural) + 
                      parseInt(formData.weight_potential) + 
                      parseInt(formData.weight_education);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/profiles" className="text-teal-600 hover:underline mb-4 inline-block">
            ← Volver a Perfiles
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Crear Perfil de Cargo</h1>
          <p className="text-gray-600">Define los requisitos y criterios específicos para esta posición</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Título del Cargo *</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ej: Desarrollador Full Stack Senior"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Descripción del Cargo *</label>
              <textarea
                required
                rows={4}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe las responsabilidades y el contexto del cargo..."
              />
            </div>
          </div>

          {/* Skills y Requisitos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Skills y Requisitos</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Must-Have Skills (Obligatorios) *
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                value={formData.must_have_skills}
                onChange={(e) => setFormData({...formData, must_have_skills: e.target.value})}
                placeholder="JavaScript, React, Node.js (separados por comas)"
              />
              <p className="text-xs text-gray-500 mt-1">Separa cada skill con coma</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Nice-to-Have Skills (Deseables)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                value={formData.nice_to_have_skills}
                onChange={(e) => setFormData({...formData, nice_to_have_skills: e.target.value})}
                placeholder="TypeScript, Docker, AWS (separados por comas)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Deal-Breakers (Rechazo automático)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                value={formData.deal_breakers}
                onChange={(e) => setFormData({...formData, deal_breakers: e.target.value})}
                placeholder="Menos de 2 años experiencia, No sabe Git (separados por comas)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Años de Experiencia Mínimos
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                value={formData.years_experience_min}
                onChange={(e) => setFormData({...formData, years_experience_min: e.target.value})}
              />
            </div>
          </div>

          {/* Valores Culturales */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Valores Culturales</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Valores de la Empresa
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                value={formData.cultural_values}
                onChange={(e) => setFormData({...formData, cultural_values: e.target.value})}
                placeholder="Autonomía, Trabajo en equipo, Innovación (separados por comas)"
              />
            </div>
          </div>

          {/* Ponderación */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Ponderación de Dimensiones 
              <span className={`ml-2 text-sm ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                (Total: {totalWeight}% {totalWeight !== 100 && '- Debe sumar 100%'})
              </span>
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Competencias Técnicas (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                  value={formData.weight_technical}
                  onChange={(e) => setFormData({...formData, weight_technical: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Experiencia (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                  value={formData.weight_experience}
                  onChange={(e) => setFormData({...formData, weight_experience: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ajuste Cultural (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                  value={formData.weight_cultural}
                  onChange={(e) => setFormData({...formData, weight_cultural: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Potencial (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                  value={formData.weight_potential}
                  onChange={(e) => setFormData({...formData, weight_potential: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Educación (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                  value={formData.weight_education}
                  onChange={(e) => setFormData({...formData, weight_education: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Ejemplos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Ejemplos y Patrones</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Candidato Ideal (Ejemplo)
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                value={formData.ideal_candidate_example}
                onChange={(e) => setFormData({...formData, ideal_candidate_example: e.target.value})}
                placeholder="Describe un ejemplo de candidato perfecto para este cargo..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Anti-Patrones (Lo que NO queremos)
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500"
                value={formData.anti_patterns}
                onChange={(e) => setFormData({...formData, anti_patterns: e.target.value})}
                placeholder="Describe perfiles que definitivamente NO son adecuados..."
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || totalWeight !== 100}
              className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Creando...' : 'Crear Perfil'}
            </button>
            <Link 
              href="/profiles"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}