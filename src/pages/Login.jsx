import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import useAuth from '../hooks/useAuth'

/* Para formularios pequeños no vale la pena utilizar useForm. En su lugar, es mejor utilizar useState */

// Función de Inicio de Sesión
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // Método login de useAuth
  const { login } = useAuth()
  // Funciones de navegación y locación
  const navigate = useNavigate()
  const location = useLocation()
  // Función que indica a que ruta se dirigirá
  const from = location.state?.from?.pathname || '/events'

  // Función que maneja la carga del inicio de sesión
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try { await login({ email, password }); navigate(from, { replace: true }) }
    catch (err) { setError(err?.message || 'No se pudo iniciar sesión.') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h1 className="text-2xl font-semibold mb-2">Bienvenido a {import.meta.env.VITE_APP_NAME || 'La Plataforma'}</h1>
        <p className="opacity-80 mb-6">Tu sesión permanece activa tras recargar</p>

        {/* El primer onSubmit nos dice que se aplicará una acción: La función onSubmit definida en esta página */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Correo</label>
            <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input className="input" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {/* Mientras esté cargando, el botón está desactivado */}
          <Button disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</Button>
        </form>

        <p className="text-sm mt-4">
          ¿No tienes cuenta? <Link to="/register" className="underline">Regístrate</Link>
        </p>
        
      </Card>
    </div>
  )
}