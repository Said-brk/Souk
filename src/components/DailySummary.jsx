import { useState, useEffect } from 'react'
import { addDailySummary, getTodaySummary, getTodayOrders } from '../services/supabase'

export default function DailySummary({ userId }) {
  const [summary, setSummary] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    amountCashed: '',
    notes: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoading(true)
    const [summaryData, ordersData] = await Promise.all([
      getTodaySummary(userId),
      getTodayOrders(userId),
    ])
    setSummary(summaryData)
    setOrders(ordersData)
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (!formData.amountCashed) {
        setError('Veuillez entrer le montant encaissé')
        return
      }

      await addDailySummary(userId, {
        amountCashed: parseFloat(formData.amountCashed),
        totalOrders: orders.length,
        notes: formData.notes,
      })

      setSuccess('✓ Bilan du jour enregistré avec succès')
      setFormData({
        amountCashed: '',
        notes: '',
      })
      setShowForm(false)
      loadData()
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement')
    }
  }

  // Calculs
  const pickedUpOrders = orders.filter(o => o.status === 'picked_up')
  const totalRevenue = pickedUpOrders.reduce((sum, o) => {
    return sum + (o.quantity * (o.products?.price || 0))
  }, 0)

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-market-600 hover:bg-market-700 text-white rounded-lg transition font-medium"
        >
          {showForm ? '✕ Fermer' : '📊 Enregistrer le bilan'}
        </button>
        <button
          onClick={loadData}
          className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition font-medium"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-market-700">Enregistrer le bilan du jour</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant encaissé (MAD)
              </label>
              <input
                type="number"
                name="amountCashed"
                value={formData.amountCashed}
                onChange={handleChange}
                placeholder="ex: 8500"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              />
              <p className="text-xs text-gray-600 mt-1">
                Montant basé sur les commandes retirées: {totalRevenue.toFixed(2)} MAD
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="ex: Peu de demande, stock restant..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-market-600 hover:bg-market-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            ✓ Enregistrer le bilan
          </button>
        </form>
      )}

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">📋 Commandes du jour</p>
          <p className="text-4xl font-bold text-blue-700 mt-2">{orders.length}</p>
          <p className="text-xs text-blue-600 mt-1">
            {pickedUpOrders.length} retirée{pickedUpOrders.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <p className="text-green-600 text-sm font-medium">💰 Revenu estimé</p>
          <p className="text-4xl font-bold text-green-700 mt-2">
            {totalRevenue.toFixed(0)}
          </p>
          <p className="text-xs text-green-600 mt-1">MAD (commandes retirées)</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">⏳ En attente</p>
          <p className="text-4xl font-bold text-purple-700 mt-2">
            {orders.filter(o => o.status === 'reserved').length}
          </p>
          <p className="text-xs text-purple-600 mt-1">Commandes à retirer</p>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <p className="text-orange-600 text-sm font-medium">📅 Date</p>
          <p className="text-2xl font-bold text-orange-700 mt-2">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            })}
          </p>
          <p className="text-xs text-orange-600 mt-1">
            {new Date().toLocaleTimeString('fr-FR', { 
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Bilan enregistré */}
      {summary && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-bold text-market-700 mb-4">✓ Bilan enregistré</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-sm">Montant encaissé</p>
              <p className="text-2xl font-bold text-market-700">
                {summary.amount_cashed} MAD
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Commandes traitées</p>
              <p className="text-2xl font-bold text-market-700">
                {summary.total_orders}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Enregistré à</p>
              <p className="text-2xl font-bold text-market-700">
                {new Date(summary.created_at).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {summary.notes && (
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Notes:</p>
              <p className="text-gray-600">{summary.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Détail des commandes retirées */}
      {pickedUpOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-market-700">
              ✓ Commandes retirées aujourd'hui ({pickedUpOrders.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {pickedUpOrders.map(order => (
              <div key={order.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{order.client_name}</p>
                    <p className="text-sm text-gray-600">
                      {order.products?.name} • {order.quantity} {order.products?.unit}
                    </p>
                  </div>
                  <p className="font-bold text-market-600">
                    {(order.quantity * (order.products?.price || 0)).toFixed(2)} MAD
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-market-50 p-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-market-700">
              {totalRevenue.toFixed(2)} MAD
            </p>
          </div>
        </div>
      )}

      {/* Message vide */}
      {loading === false && orders.length === 0 && !summary && (
        <div className="bg-yellow-50 p-8 rounded-lg border border-yellow-200 text-center">
          <p className="text-lg text-yellow-800 mb-2">📊 Aucune donnée pour aujourd'hui</p>
          <p className="text-sm text-yellow-700">Les commandes et bilans apparaîtront ici</p>
        </div>
      )}
    </div>
  )
}
