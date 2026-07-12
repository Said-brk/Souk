import { useState, useEffect } from 'react'
import { getUserProfile, signOut } from '../services/supabase'
import AddProduct from './AddProduct'
import OrderBook from './OrderBook'
import ClientHistory from './ClientHistory'
import DailySummary from './DailySummary'

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('add-product')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getUserProfile(user.id)
      setProfile(data)
      setLoading(false)
    }
    loadProfile()
  }, [user.id])

  const handleLogout = async () => {
    await signOut()
    onLogout()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-market-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-market-700">🛒 Carreau Market</h1>
            {profile && (
              <p className="text-sm text-gray-600">
                {profile.name} • {profile.category}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'add-product', label: '➕ Ajouter produit', icon: '📝' },
              { id: 'orders', label: '📋 Commandes', icon: '✓' },
              { id: 'clients', label: '👥 Clients', icon: '💰' },
              { id: 'summary', label: '📊 Bilan du jour', icon: '📈' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 border-b-2 transition whitespace-nowrap text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-market-600 text-market-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'add-product' && <AddProduct userId={user.id} />}
        {activeTab === 'orders' && <OrderBook userId={user.id} />}
        {activeTab === 'clients' && <ClientHistory userId={user.id} />}
        {activeTab === 'summary' && <DailySummary userId={user.id} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Carreau Market © 2024 • Simplifier le marché de gros</p>
        </div>
      </footer>
    </div>
  )
}
