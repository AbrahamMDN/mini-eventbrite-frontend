import { useState } from 'react'
import Card from '../components/Card'
import { scanTicket } from '../services/api'
import { decodeQrFromImageFile } from '../utils/qrDecode'

// Función que maneja el scaneo de un QR desde el FrontEnd
export default function Scan() {
  // Estados iniciales
  const [tokenJson, setTokenJson] = useState('')
  const [ticketId, setTicketId] = useState('')
  const [imgName, setImgName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [hint, setHint] = useState(null)

  // Subfunción asíncrona que maneja la lectura del QR como imagen 
  const handleImage = async (file) => {
    // Carga del archivo
    if (!file) return
    setImgName(file.name)
    setError(null); setHint(null); setResult(null)
    // Decodificación del QR
    try {
      const data = await decodeQrFromImageFile(file)
      if (!data) { setError('No se pudo leer un QR válido en la imagen.'); return }

      // Parseo de infromación recuperada, actualización de estadps y manejo de errores de lectura de parámetros
      try {
        const parsed = JSON.parse(data)
        if (parsed?.t && parsed?.s) {
          setTokenJson(JSON.stringify(parsed))
          setTicketId(parsed.t)
          setHint('QR con token válido detectado (t + s). Puedes enviar para check-in.')
          return
        }
      } catch {}

      if (/^[a-f0-9]{24}$/i.test(data.trim())) {
        setTicketId(data.trim())
        setHint('QR contiene solo ticketId. /scan requiere firma HMAC. Usa endpoint alterno o genera tokens firmados.')
      } else {
        setError('Contenido del QR no reconocido. Esperaba {"t","s"} o un ObjectId.')
      }
    } catch (e) {
      setError(e.message || 'Error leyendo la imagen.')
    }
  }

  // Subfunción asíncrona que envía la información recuperada a la función de escaneo en la API, con manejo de errores
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null); setResult(null)
    try {
      if (tokenJson.trim()) {
        const res = await scanTicket({ token: tokenJson.trim() })
        setResult(res)
      } else if (ticketId.trim()) {
        setError('Este flujo espera token JSON firmado. Solo ticketId requiere un endpoint alterno en backend.')
      } else {
        setError('Proporciona un token JSON o un ticketId.')
      }
    } catch (e2) {
      setError(e2.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h1 className="text-2xl font-semibold mb-4">Escanear / Check-in</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            {/* Campo para subir imagen del QR */}
            <label className="label">Sube una imagen con el QR</label>
            <input type="file" accept="image/*" className="block" onChange={(e) => handleImage(e.target.files?.[0])} />
            {imgName && <p className="text-xs opacity-70 mt-1">Archivo: {imgName}</p>}
          </div>
          {/* Campo para subir parámetros t, s del QR */}
          <div>
            <label className="label">Token JSON del QR (oficial /scan)</label>
            <textarea className="input" rows={4} placeholder='{"t":"<ticketId>","s":"<hex_hmac_signature>"}' value={tokenJson} onChange={(e) => setTokenJson(e.target.value)} />
          </div>
          {/* Campo para subir manualmente ID del QR */}
          <div>
            <label className="label">TicketId (entrada manual)</label>
            <input className="input" placeholder="64f1c3a2b9d2f1a5d3e8c7b9" value={ticketId} onChange={(e) => setTicketId(e.target.value)} />
          </div>
          {/* Mensajes para errores, pista y resultado */}
          {hint && <p className="text-amber-600 text-sm">{hint}</p>}
          {error && <p className="text-red-600">{error}</p>}
          {result && (
            <pre className="text-sm bg-black/5 dark:bg-white/5 p-3 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          )}
          {/* Botón para validar lectura */}
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Validando...' : 'Validar'}</button>
        </form>
        {/* Leyenda para casos específicos */}
        <p className="text-xs opacity-70 mt-4">
          Nota: si el QR solo tiene <code>ticketId</code>, tu backend debe exponer un endpoint alterno (p.ej. <code>POST /scan-by-id</code>)
          o bien generar el QR con token firmado (campos <code>t</code> y <code>s</code>).
        </p>
      </Card>
    </div>
  )
}