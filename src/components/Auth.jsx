import { useState } from 'react'
import { signIn, signUp } from '../services/supabase'

export default function Auth({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    category: 'légumes',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.phone,
          formData.category
        )
        // Connecter automatiquement après inscription
        await signIn(formData.email, formData.password)
      } else {
        await signIn(formData.email, formData.password)
      }
      onAuthSuccess()
    } catch (err) {
      setError(err.message || 'Erreur d\'authentification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-market-500 to-market-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-market-700">
          🛒 Carreau Market
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Gestion simplifiée du marché de gros
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 focus:border-transparent outline-none"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du grossiste
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 focus:border-transparent outline-none"
                  placeholder="Votre nom ou raison sociale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 focus:border-transparent outline-none"
                  placeholder="+212 6XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 focus:border-transparent outline-none"
                >
                  <option value="légumes">🥬 Légumes</option>
                  <option value="fruits">🍎 Fruits</option>
                  <option value="viande">🥩 Viande</option>
                  <option value="poisson">🐟 Poisson</option>
                  <option value="épicerie">🛍️ Épicerie</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-market-600 hover:bg-market-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Chargement...' : isSignUp ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError('')
          }}
          className="w-full mt-4 text-market-600 hover:text-market-700 text-sm font-medium"
        >
          {isSignUp ? 'Vous avez déjà un compte ? Se connecter' : 'Pas encore de compte ? S\'inscrire'}
        </button>
      </div>
    </div>
  )
}
