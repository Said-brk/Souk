import { useState, useEffect } from 'react'
import { addProduct, getTodayProducts } from '../services/supabase'

export default function AddProduct({ userId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    deadline: '11:00',
    photoUrl: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadProducts()
  }, [userId])

  const loadProducts = async () => {
    setLoading(true)
    const data = await getTodayProducts(userId)
    setProducts(data)
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
      if (!formData.name || !formData.quantity || !formData.price || !formData.deadline) {
        setError('Tous les champs sont requis')
        return
      }

      await addProduct(userId, {
        name: formData.name,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        price: parseFloat(formData.price),
        deadline: formData.deadline,
        photoUrl: formData.photoUrl,
      })

      setSuccess(`✓ ${formData.name} ajouté avec succès`)
      setFormData({
        name: '',
        quantity: '',
        unit: 'kg',
        price: '',
        deadline: '11:00',
        photoUrl: '',
      })
      setShowForm(false)
      loadProducts()
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout')
    }
  }

  const generatePriceSheet = () => {
    if (products.length === 0) {
      setError('Aucun produit à afficher')
      return
    }

    let sheet = `📋 PRIX DU JOUR\n${'='.repeat(40)}\n`
    sheet += `📅 ${new Date().toLocaleDateString('fr-FR')}\n\n`

    products.forEach((product, idx) => {
      sheet += `${idx + 1}. ${product.name}\n`
      sheet += `   • Quantité: ${product.quantity} ${product.unit}\n`
      sheet += `   • Prix: ${product.price} MAD/${product.unit}\n`
      sheet += `   • Retrait avant: ${product.deadline}\n\n`
    })

    sheet += `⏰ Pas de stock garanti après les horaires indiqués\n`
    sheet += `📞 Commande par WhatsApp`

    // Copier au clipboard
    navigator.clipboard.writeText(sheet)
    setSuccess('✓ Feuille de prix copiée au clipboard!')
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
          {showForm ? '✕ Fermer' : '➕ Ajouter un produit'}
        </button>
        <button
          onClick={generatePriceSheet}
          disabled={products.length === 0}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium disabled:opacity-50"
        >
          📋 Générer ma feuille de prix
        </button>
        <button
          onClick={loadProducts}
          className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition font-medium"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-market-700">Ajouter un produit</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produit
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ex: Tomate, Pomme de terre..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantité
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="ex: 80"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unité
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              >
                <option value="kg">kg</option>
                <option value="caisse">caisse</option>
                <option value="botte">botte</option>
                <option value="pièce">pièce</option>
                <option value="sac">sac</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix par unité (MAD)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="ex: 7.50"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure limite de retrait
              </label>
              <input
                type="time"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de la photo (optionnel)
              </label>
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-market-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-market-600 hover:bg-market-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            ✓ Ajouter le produit
          </button>
        </form>
      )}

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-market-700">
            Produits du jour ({products.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-market-600 mx-auto mb-2"></div>
            Chargement...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg mb-2">📦 Aucun produit ajouté aujourd'hui</p>
            <p className="text-sm">Cliquez sur "Ajouter un produit" pour commencer</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {products.map(product => (
              <div key={product.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Ajouté à {new Date(product.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-market-50 text-market-700 text-sm font-medium rounded">
                    {product.price} MAD/{product.unit}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Stock</p>
                    <p className="font-bold text-lg text-market-600">
                      {product.quantity} {product.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Retrait avant</p>
                    <p className="font-bold text-market-600">{product.deadline}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Montant total</p>
                    <p className="font-bold text-market-600">
                      {(product.quantity * product.price).toFixed(2)} MAD
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Statut</p>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      ✓ Disponible
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
