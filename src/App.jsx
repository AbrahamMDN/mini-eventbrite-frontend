import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateEvent from './pages/CreateEvent'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import useAuth from './hooks/useAuth'
import useLastVisited from './hooks/useLastVisited'

// Lógica de la Estructura de Rutas de la App
export default function App() {
  // Métodos y respuestas de useAuth
  const { isAuthenticated, user } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  // Respuestas de useLastVisited
  const { setLastPath, getLastPath } = useLastVisited()

  // Efecto que actualiza la última ruta visitada al inicializar la aplicación
  useEffect(() => { setLastPath(pathname) }, [pathname, setLastPath])

  // Efecto que me permite navegar a mi última ruta visitada al inicializar la aplicación
  useEffect(() => {
    if (window.location.pathname === '/') {
      const last = getLastPath()
      if (last && isAuthenticated() && last !== '/') navigate(last, { replace: true })
    }
  }, [isAuthenticated, getLastPath, navigate])

  const hasRole = (...roles) => roles.includes(user?.role)

  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className="container-app py-8">
              <Routes>
                <Route path='/' element={<Login/>} />
                <Route path='/register' element={<Register/>} />
                <Route
                 path='/events/new' 
                 element={ 
                  <ProtectedRoute>
                    { hasRole('organizer','admin') ? <CreateEvent /> : <NotFound />}
                  </ProtectedRoute>
                 }
                />
                {/*<Route
                 path='/scan' 
                 element={ 
                  <ProtectedRoute>
                    { hasRole('organizer','admin','staff') ? <Scan /> : <NotFound />}
                  </ProtectedRoute>
                 }
                />*/}
                <Route path='*' element={<NotFound/>} />
              </Routes>
      </main>
    </div>
  )
}