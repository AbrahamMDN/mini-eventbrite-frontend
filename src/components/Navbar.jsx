import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

// Esquema de una Navbar
export default function Navbar(){
  // Métodos y respuestas de useAuth
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const hasRole = (...roles) => roles.includes(user?.role)
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="container-app py-4 flex items-center justify-between">
        <Link to="/events" className="text-xl font-semibold">
          {import.meta.env.VITE_APP_NAME || 'App'}
        </Link>

        <nav className="flex items-center gap-3">
          {/* Botón para ver listado de eventos */}
          <Link to='/events' className='btn'>Eventos</Link>

          {/* Botón para redirección a formulario para crear eventos si se es organizador o admin */}
          {isAuthenticated() && hasRole('organizer', 'admin') && (
            <Link to="/events/new" className="btn btn-primary">Crear evento</Link>
          )}

          {/* Botón para redirección a formulario para escanear QRs si se es organizador, admin o staff */}
          {isAuthenticated() && hasRole('organizer', 'staff','admin') && (
            <Link to="/scan" className="btn btn-primary">Escanear</Link>
          )}

          {/* Si el usuario está autenticado, se muestra su nombre o correo y la opción de cerrar sesión. Si no lo está, se muestran enlaces a inicio de sesión y registro */}

          {isAuthenticated() ? (
            <>
              <span className="text-sm opacity-80">Hola, {user?.name || user?.email}</span>
              <button className="btn" onClick={() => { logout(); navigate('/'); }}>Salir</button>
            </>
          ) : (
            <>
              <Link className="btn" to="/">Login</Link>
              <Link className="btn btn-primary" to="/register">Registro</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}