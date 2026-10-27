import React,{ createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api.js'
const ProblemsContext = createContext(null)
export function ProblemsProvider({ children }) {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const refresh = async () => {
    try { const rows = await api('/problems'); setProblems(rows); setError(null) }
    catch (e) { setError(e.message || 'Unable to load campus problems.'); }
    finally { setLoading(false) }
  }
  useEffect(() => { if (localStorage.getItem('campuspulse_token')) refresh(); else setLoading(false) }, [])
  const addProblem = async (data) => {
    const created = await api('/problems', { method: 'POST', body: JSON.stringify(data) })
    setProblems((prev) => [created, ...prev]); return created
  }
  const updateStatus = async (id, status) => {
    await api(`/problems/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
    setProblems((prev) => prev.map((p) => (String(p.id) === String(id) ? { ...p, status } : p)))
  }
  return <ProblemsContext.Provider value={{ problems, loading, error, addProblem, updateStatus, refresh }}>{children}</ProblemsContext.Provider>
}
export function useProblems() {
  const ctx = useContext(ProblemsContext)
  if (!ctx) throw new Error('useProblems must be used inside a ProblemsProvider')
  return ctx
}
