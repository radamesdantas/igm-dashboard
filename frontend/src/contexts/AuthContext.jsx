import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('igm_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password
      })

      const userData = response.data.user
      setUser(userData)
      localStorage.setItem('igm_user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login'
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('igm_user')
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
