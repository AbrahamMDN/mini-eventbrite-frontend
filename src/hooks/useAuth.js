// Se importan elementos de zustand para compartir estados globales: Creación y Persistencia
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as api from '../services/api'

// Hook para funciones con autorización
const useAuth = create(
  persist(
    // Variables que se envían y se recuperan de la API
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,

      // Se pregunta si existe un token de autenticación
      isAuthenticated: () => Boolean(get().token),

      /* Dentro de un Hook, todos sus elementos de dividen por comas */

      // Método de inicio de sesión
      login: async (credentials) => {
        const res = await api.login(credentials)
        // Recuperación de token, refresh token e información del usuario en la respuesta
        set({ token: res?.accessToken, refreshToken: res?.refreshToken, user: res?.user })
        return res
      },

      // Método de registro
      register: async (payload) => {
        const res = await api.register(payload)
        set({ token: res?.accessToken, refreshToken: res?.refreshToken, user: res?.user })
        return res
      },

      // Método de recuperación de información del usuario
      loadMe: async () => {
        const res = await api.me()
        if (res?.user) set({ user: res.user })
        return res
      },

      // Método de cierre de sesión
      logout: () => set({ token: null, refreshToken: null, user: null }),
    }),
    // Persistencia de la información si hay un inicio de sesión activo
    {
      name: 'quickpass-auth',
      // Persistencia de la información en cookies
      partialize: (s) => ({ token: s.token, refreshToken: s.refreshToken, user: s.user })
    }
  )
)

export default useAuth