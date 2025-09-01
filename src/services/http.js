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
    // Puede devolver un error de un JSON, de un mensaje o no especificado. Para cada caso, se devuelve un mensaje
    const message = error?.response?.data?.message || error?.message || 'Error de red'
    return Promise.reject(new Error(message))
  }
)

export default http