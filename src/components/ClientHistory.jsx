import { useState, useEffect } from 'react'
import { getClientHistory } from '../services/supabase'

export default function ClientHistory({ userId }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('spent') // 'spent' ou 'count'

  useEffect(() => {
    loadClients()
  }, [userId])

  const loadClients = async () => {
    setLoading(true)
    const data = await getClientHistory(userId)
    setClients(data)
    setLoading(false)
  }

  const sortedClients = [...clients].sort((a, b) => {
    if (sortBy === 'spent') {
      return b.totalSpent - a.totalSpent
    } else {
      return b.orderCount - a.orderCount
    }
  })

  return (
    <div className="space-y-6">
      {/* Boutons d'action */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={loadClients}
          className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition font-medium"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Tri */}
      <div className="flex gap-2">
        <button
          onClick={() => setSortBy('spent')}
          className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
            sortBy === 'spent'
              ? 'bg-market-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          💰 Par montant dépensé
        </button>
        <button
          onClick={() => setSortBy('count')}
          className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
            sortBy === 'count'
              ? 'bg-market-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          📊 Par nombre de commandes
        </button>
      </div>

      {/* Liste des clients */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-market-700">
            👥 Mes clients ({clients.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Historique complet de vos clients réguliers
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-market-600 mx-auto mb-2"></div>
            Chargement...
          </div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg mb-2">👥 Aucun client pour le moment</p>
            <p className="text-sm">Les clients apparaîtront ici après vos premières ventes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Commandes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Montant total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Dernier achat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedClients.map((client, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-market-100 flex items-center justify-center text-market-700 font-bold">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                        {client.orderCount} achat{client.orderCount > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-market-600 text-lg">
                        {client.totalSpent.toFixed(2)} MAD
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {client.lastOrder
                        ? new Date(client.lastOrder).toLocaleDateString('fr-FR')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistiques */}
      {clients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm font-medium">Total clients</p>
            <p className="text-4xl font-bold text-blue-700 mt-2">{clients.length}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm font-medium">Montant total généré</p>
            <p className="text-4xl font-bold text-green-700 mt-2">
              {clients.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(0)} MAD
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <p className="text-purple-600 text-sm font-medium">Moyenne par client</p>
            <p className="text-4xl font-bold text-purple-700 mt-2">
              {(clients.reduce((sum, c) => sum + c.totalSpent, 0) / clients.length).toFixed(0)} MAD
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
