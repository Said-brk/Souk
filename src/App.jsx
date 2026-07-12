import { useState, useEffect } from 'react'
import { supabase } from './services/supabase'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier la session actuelle
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-market-500 to-market-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Carreau Market</p>
        </div>
      </div>
    )
  }

  return user ? (
    <Dashboard user={user} onLogout={() => setUser(null)} />
  ) : (
    <Auth onAuthSuccess={() => {}} />
  )
}

export default App
