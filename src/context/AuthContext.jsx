import React, { createContext, useContext, useState } from 'react'
import { USERS } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (role, password) => {
    const found = USERS[role]
    if (found && found.password === password) {
      setUser(found)
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
