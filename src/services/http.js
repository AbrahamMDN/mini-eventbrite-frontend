// Axios permite la conexión con APIs
import axios from 'axios'
// Autorización en función del rol
import useAuth from '../hooks/useAuth'

// Se crea la conexión para consumo del servicio frontend
const http = axios.create({
  // A partir de variables de entorno o valores por default
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 15000)
})

// Uso de conexión para envío de petición
http.interceptors.request.use((config) => {
  // Verificar existencia del token
  const { token } = useAuth.getState()
  // Vinculación del token con headers de autorización
  if (token) config.headers.Authorization = `Bearer ${token}`
  // Se devuelve la configuración ya con un token asignado
  return config
})

// Uso de conexión para recepción de datos
http.interceptors.response.use(
  (res) => res,
  (error) => {
    // Extracción de datos relevantes del error de forma individual
    const res = error?.response
    const errData = res?.data?.error || {}
    const fallbackMessage = error?.message || 'Error de red' // Opción para mensaje alternativo

    // Creación de nuevo error con código y detalles del backend
    const err = new Error(errData.message || fallbackMessage)
    err.code = errData.code || res?.status || 'UNKNOWN'
    err.details = errData.details || null
    return Promise.reject(err)
  }
)

export default http