import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import { listEvents } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

// Función que crea la lógica y diseño de la página de Eventos para el FrontEnd
export default function Events() {
    // Estados iniciales
    // Los eventos individuales se almacenan en la variable items
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Conexión con API para traer todos los eventos en el montaje
    useEffect(() => {
        (async () => {
        try {
            const res = await listEvents()
            setItems(res?.items || [])
        } catch (e) { setError(e.message) }
        finally { setLoading(false) }
        })()
    }, [])

    // Si está cargando, se muestra el componente de carga. Si hay un error, se muestra en pantalla
    if (loading) return <LoadingSpinner />
    if (error) return <p className="text-red-600">{error}</p>

    return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map(ev => (
        <Card key={ev._id} className="p-0 overflow-hidden">
          <img src={ev.imageUrl} alt={ev.title} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h2 className="text-lg font-semibold">{ev.title}</h2>
            <p className="opacity-80 text-sm mb-2">{new Date(ev.date).toLocaleString()}</p>
            <p className="opacity-80 text-sm mb-4">{ev.venue}</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold">${ev.price?.toLocaleString('es-MX')}</span>
              {/* Botón para redirección a ver detalles del evento */}
              <Link to={`/events/${ev._id}`} className="btn btn-primary">Ver detalles</Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}