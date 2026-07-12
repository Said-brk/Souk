import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL et clé anon sont requis. Vérifiez votre .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth functions
export const signUp = async (email, password, name, phone, category) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // Créer le profil utilisateur
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          phone,
          category,
        })

      if (profileError) throw profileError
    }

    return authData
  } catch (error) {
    throw error
  }
}

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Erreur:', error)
    return null
  }
}

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur:', error)
    return null
  }
}

// Products functions
export const addProduct = async (userId, product) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: userId,
        product_reference_id: product.productRefId,
        quantity: product.quantity,
        unit: product.unit,
        price: product.price,
        photo_url: product.photoUrl,
        deadline: product.deadline,
      })
      .select('*, product_references(name)')

    if (error) throw error
    return data[0]
  } catch (error) {
    throw error
  }
}

export const getTodayProducts = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('products')
      .select('*, product_references(name)')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erreur:', error)
    return []
  }
}

// Orders functions
export const addOrder = async (userId, order) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        product_id: order.productId,
        client_name: order.clientName,
        quantity: order.quantity,
        status: order.status || 'reserved',
      })
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    throw error
  }
}

export const getTodayOrders = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(*, product_references(name))')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erreur:', error)
    return []
  }
}

export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', orderId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    throw error
  }
}

// Client history
export const getClientHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('client_name, quantity, products(price, product_references(name)), created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    // Agréger par client
    const clientMap = {}
    if (data) {
      data.forEach(order => {
        if (!clientMap[order.client_name]) {
          clientMap[order.client_name] = {
            name: order.client_name,
            totalSpent: 0,
            orderCount: 0,
            lastOrder: order.created_at,
          }
        }
        clientMap[order.client_name].totalSpent += (order.products?.price || 0) * order.quantity
        clientMap[order.client_name].orderCount += 1
      })
    }

    return Object.values(clientMap)
  } catch (error) {
    console.error('Erreur:', error)
    return []
  }
}

// Daily summary
export const addDailySummary = async (userId, summary) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('daily_summaries')
      .insert({
        user_id: userId,
        date: today,
        amount_cashed: summary.amountCashed,
        total_orders: summary.totalOrders,
        notes: summary.notes,
      })
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    throw error
  }
}

export const getTodaySummary = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('daily_summaries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (error?.code === 'PGRST116') {
      // Pas de résumé pour aujourd'hui
      return null
    }

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur:', error)
    return null
  }
}