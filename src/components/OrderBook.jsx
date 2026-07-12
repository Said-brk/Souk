import { useState, useEffect } from 'react'
import { addOrder, getTodayOrders, updateOrderStatus, getTodayProducts } from '../services/supabase'

export default function OrderBook({ userId }) {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    clientName: '',
    quantity: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoading(true)
    const [ordersData, productsData] = await Promise.all([
      getTodayOrders(userId),
      getTodayProducts(userId),
    ])
    setOrders(ordersData)
    setProducts(productsData)
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
      if (!formData.productId || !formData.clientName || !formData.quantity) {
        setError('Tous les champs sont requis')
        return
      }

      await addOrder(userId, {
        productId: formData.productId,
        clientName: formData.clientName,
        quantity: parseFloat(formData.quantity),
      })

      setSuccess('✓ Commande ajoutée avec succès')
      setFormData({
        productId: '',
        clientName: '',
        quantity: '',
      })
      setShowForm(false)
      loadData()
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout')
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      loadData()
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour')
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'reserved':
        return 'bg-blue-100 text-blue-800'
      case 'picked_up':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'reserved':
        return '⏳ Réservé'
      case 'picked_up':
        return '✓ Retiré'
      case 'cancelled':
        return '✕ Annulé'
      default:
        return status
    }
  }

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
          {showForm ? '✕ Fermer' : '➕ Nouvelle commande'}
        </button>
        <button
          onClick={loadData}
          className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition font-medium"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Formulaire */}
      {showForm && products.length > 0 && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-market-700">Ajouter une commande</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produit
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              >
                <option value="">-- Sélectionner un produit --</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.product_references?.name || 'Produit'} - {product.quantity} {product.unit} à {product.price} MAD
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du client
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="ex: Resto Ali, Épicerie..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantité commandée
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="ex: 10"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-market-600 hover:bg-market-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            ✓ Ajouter la commande
          </button>
        </form>
      )}

      {products.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          ⚠️ Aucun produit disponible. Ajoute d'abord des arrivages.
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'all', label: '📋 Tous' },
          { id: 'reserved', label: '⏳ Réservées' },
          { id: 'picked_up', label: '✓ Retirées' },
          { id: 'cancelled', label: '✕ Annulées' },
        ].map(filterOption => (
          <button
            key={filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
              filter === filterOption.id
                ? 'bg-market-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-market-700">
            Carnet de commandes ({filteredOrders.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-market-600 mx-auto mb-2"></div>
            Chargement...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg mb-2">📭 Aucune commande</p>
            <p className="text-sm">Les commandes apparaîtront ici</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{order.client_name}</h4>
                    <p className="text-sm text-gray-600">
                      {order.products?.product_references?.name || 'Produit'} • {order.quantity} {order.products?.unit}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Montant</p>
                    <p className="font-bold text-market-600">
                      {(order.quantity * (order.products?.price || 0)).toFixed(2)} MAD
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Heure</p>
                    <p className="font-bold">
                      {new Date(order.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions pour changer le statut */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleStatusChange(order.id, 'reserved')}
                    disabled={order.status === 'reserved'}
                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded disabled:opacity-50"
                  >
                    ⏳ Réserver
                  </button>
                  <button
                    onClick={() => handleStatusChange(order.id, 'picked_up')}
                    disabled={order.status === 'picked_up'}
                    className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-sm rounded disabled:opacity-50"
                  >
                    ✓ Retiré
                  </button>
                  <button
                    onClick={() => handleStatusChange(order.id, 'cancelled')}
                    disabled={order.status === 'cancelled'}
                    className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-sm rounded disabled:opacity-50"
                  >
                    ✕ Annuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
