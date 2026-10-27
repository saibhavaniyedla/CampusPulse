
import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api.js'

export const DEMO_ACCOUNTS = {
  student: { email: 'student@campuspulse.com', password: 'student123' },
  admin: { email: 'admin@campuspulse.com', password: 'admin123' },
}

const SESSION_KEY = 'campuspulse_session'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [profiles, setProfiles] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('campuspulse_token')

    if (!token) {
      setReady(true)
      return
    }

    api('/auth/me')
      .then((u) => {
        setUser(u)
        setProfiles((p) => ({ ...p, [u.role]: u }))
      })
      .catch(() => {
        localStorage.removeItem('campuspulse_token')
        localStorage.removeItem(SESSION_KEY)
      })
      .finally(() => setReady(true))
  }, [])

  // Register a new student account
  const register = async (name, email, password) => {
  if (!name.trim() || !email.trim() || !password) {
    return {
      success: false,
      error: 'Please fill in all required fields.',
    }
  }

  try {
    const result = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'student',
      }),
    })

    return { success: true, user: result.user }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

  // Log in an existing account
  const login = async (email, password, role) => {
    if (!email.trim() || !password) {
      return {
        success: false,
        error: 'Enter both email and password.',
      }
    }

    try {
      const result = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      })

      if (!result.access_token || !result.user) {
        return {
          success: false,
          error: 'Invalid server response. Please try again.',
        }
      }

      localStorage.setItem('campuspulse_token', result.access_token)
      localStorage.setItem(SESSION_KEY, JSON.stringify(result.user))

      setUser(result.user)
      setProfiles((p) => ({
        ...p,
        [result.user.role]: result.user,
      }))

      return { success: true, role: result.user.role }
    } catch (e) {
      const message = e.message || ''

      if (
        /not registered|user not found|account not found|no account|not found/i.test(
          message
        )
      ) {
        return {
          success: false,
          error: 'Please register first. Your account was not found.',
        }
      }

      return {
        success: false,
        error: message || 'Login failed. Please check your credentials.',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('campuspulse_token')
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setProfiles({})
  }

  const getProfile = (role) =>
    profiles[role] || (user?.role === role ? user : {})

  const updateProfile = async (role, updates) => {
    const updated = await api('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })

    setProfiles((p) => ({ ...p, [role]: updated }))

    if (user?.role === role) {
      setUser(updated)
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
    }

    return updated
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        register,
        login,
        logout,
        getProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return ctx
}
