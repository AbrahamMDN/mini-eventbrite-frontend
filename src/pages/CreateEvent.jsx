import { useState } from 'react'
import Card from '../components/Card'
import { createEvent } from '../services/api'

// Función que maneja la creación de Eventos desde el FrontEnd
export default function CreateEvent() {
    // Estados iniciales
    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        venue: '',
        imageUrl: '',
        seatMap: { type: 'ga', rows: 1, cols: 1 },
        price: 0,
        isPublished: false
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [ok, setOk] = useState(null)

    // Función de cambios para events relacionados a la selección de asientos
    const onChange = (e) => {
        const { name, value, type, checked } = e.target
        if (name.startsWith('seatMap.')) {
        const key = name.split('.')[1]
        setForm((f) => ({ ...f, seatMap: { ...f.seatMap, [key]: key === 'type' ? value : Number(value) } }))
        } else {
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
        }
    }

    // Función para manejo de envío del formulario y actualización de estados
    const submit = async (e) => {
        // No envía el formulario hasta que todos lso campos estén completos
        e.preventDefault()
        setLoading(true); setError(null); setOk(null)
        try {
        const payload = { ...form, date: new Date(form.date).toISOString() }
        const res = await createEvent(payload)
        setOk(`Evento creado: ${res?.item?.title} (${res?.item?._id})`)
        } catch (e2) {
        setError(e2.message)
        } finally {
        setLoading(false)
        }
    }

    return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h1 className="text-2xl font-semibold mb-4">Crear evento</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Título</label>
            <input className="input" name="title" value={form.title} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea className="input" name="description" value={form.description} onChange={onChange} rows={3} />
          </div>
          <div>
            <label className="label">Fecha y hora</label>
            <input className="input" type="datetime-local" name="date" value={form.date} onChange={onChange} required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Lugar</label>
              <input className="input" name="venue" value={form.venue} onChange={onChange} required />
            </div>
            <div>
              <label className="label">Imagen (URL)</label>
              <input className="input" name="imageUrl" value={form.imageUrl} onChange={onChange} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label">Tipo de mapa</label>
              <select className="input" name="seatMap.type" value={form.seatMap.type} onChange={onChange}>
                <option value="ga">GA</option>
                <option value="grid">Grid</option>
              </select>
            </div>
            <div>
              <label className="label">Filas</label>
              <input className="input" type="number" min="1" name="seatMap.rows" value={form.seatMap.rows} onChange={onChange} />
            </div>
            <div>
              <label className="label">Columnas</label>
              <input className="input" type="number" min="1" name="seatMap.cols" value={form.seatMap.cols} onChange={onChange} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label">Precio</label>
              <input className="input" type="number" step="0.01" name="price" value={form.price} onChange={onChange} />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input id="pub" type="checkbox" name="isPublished" checked={form.isPublished} onChange={onChange} />
              <label htmlFor="pub">Publicar</label>
            </div>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          {ok && <p className="text-green-600">{ok}</p>}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear evento'}
          </button>
        </form>
      </Card>
    </div>
  )
}