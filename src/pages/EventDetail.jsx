import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import SeatGrid from '../components/SeatGrid'
import useAuth from '../hooks/useAuth'
import { getEvent, getOccupiedSeats, purchaseTicket } from '../services/api'

// Función que maneja la lógica y diseño de la página de Detalles sobre un Evento desde el FrontEnd
export default function EventDetail() {
  // Estados iniciales
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [item, setItem] = useState(null)
  const [occupied, setOccupied] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Efecto que busca el evento en la API y muestra los asientos ocupados si la selección es Grid
  useEffect(() => {
    (async () => {
      setLoading(true); setError(null)
      try {
        // 1) Primero trae el evento
        const evRes = await getEvent(id)
        const ev = evRes?.item || null
        setItem(ev)

        // 2) Sólo muestra los asientos ocupados si es Grid
        if (ev?.seatMap?.type === 'grid') {
          const occRes = await getOccupiedSeats(id)
          setOccupied(occRes?.occupied || [])
        } else {
          setOccupied([]) // GA: no aplica
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  // Función que maneja la lógica de una compra para usuarios autenticados 
  const onBuy = async () => {
    if (!isAuthenticated()) {
      setError('Inicia sesión para comprar.')
      return
    }
    if (item?.seatMap?.type === 'grid' && !selected) {
      setError('Selecciona un asiento.')
      return
    }

    setBuying(true); setError(null); setSuccess(null)
    try {
      const seat = item?.seatMap?.type === 'grid' ? selected : { row: 1, col: 1 }

      const res = await purchaseTicket({ eventId: item._id, seat })
      setSuccess(`Compra exitosa. Ticket ID: ${res?.id || res?._id || '—'}`)

      if (item?.seatMap?.type === 'grid' && selected) {
        setOccupied((prev) => [...prev, selected])
        setSelected(null)
      }
    // Manejo de errores para selección de asientos ya ocupados 
    } catch (e) {
      if (/occupied|duplicate|already/i.test(e.message)) {
        setError('Ese asiento ya fue tomado. Elige otro.')
        try {
          if (item?.seatMap?.type === 'grid') {
            const occ = await getOccupiedSeats(id)
            setOccupied(occ?.occupied || [])
          }
        } catch {}
      } else {
        setError(e.message)
      }
    } finally {
      setBuying(false)
    }
  }

  // Si está cargando, se muestra el componente de carga. Si hay un error o no existe el evento, se muestra en pantalla
  if (loading) return <LoadingSpinner />
  if (error && !item) return <p className="text-red-600">{error}</p>
  if (!item) return <p>No se encontró el evento.</p>

  // Simplificación de nomenclatura para variables del mapa de asientos
  const isGrid = item.seatMap?.type === 'grid'
  const rows = Number(item.seatMap?.rows || 1)
  const cols = Number(item.seatMap?.cols || 1)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Tarjeta con la información del Evento */}
      <Card className="p-0 overflow-hidden">
        <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-2xl font-semibold">{item.title}</h1>
          <p className="opacity-80">{new Date(item.date).toLocaleString()}</p>
          <p className="opacity-80 mb-2">{item.venue}</p>
          <p className="mb-4">{item.description}</p>
          <div className="text-xl font-semibold">${item.price?.toLocaleString('es-MX')}</div>
        </div>
      </Card>

      {/* Tarjeta para compra de boletos y selección de asientos si la selección es Grid */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Boletos</h2>

        {isGrid ? (
          <>
            <p className="text-sm opacity-80 mb-3">
              Selecciona un asiento disponible. Los ocupados aparecen deshabilitados.
            </p>
            <SeatGrid
              rows={rows}
              cols={cols}
              occupied={occupied}
              selected={selected}
              onSelect={setSelected}
            />
          </>
        ) : (
          <p className="text-sm opacity-80 mb-3">
            Este evento es de admisión general (GA). Se asignará lugar al ingresar.
          </p>
        )}

        {/* Mensajes de error y compra exitosa */}
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">{success}</p>}

        {/* Botón de compra */}
        <button
          className="btn btn-primary mt-4"
          onClick={onBuy}
          disabled={buying || (isGrid && !selected)}
        >
          {buying ? 'Procesando...' : 'Comprar'}
        </button>
      </Card>
    </div>
  )
}