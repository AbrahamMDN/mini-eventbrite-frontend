import { useCallback } from 'react'
// Útima URL de la App
const KEY = 'quickpass-last-path'

// Hook para persistir información de la última URL visitada
export default function useLastVisited() {
  // Aplicación de la URL
  const setLastPath = useCallback((path) => {
    try { localStorage.setItem(KEY, path) } catch {}
  }, [])

  // Recuperación de la URL
  const getLastPath = useCallback(() => {
    try { return localStorage.getItem(KEY) } catch { return null }
  }, [])

  return { setLastPath, getLastPath }
}