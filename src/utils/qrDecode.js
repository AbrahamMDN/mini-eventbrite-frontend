// Importación de componente para lecturas de QRs
import jsQR from 'jsqr'

// Función que permite decodificar un QR de forma asíncrona
export async function decodeQrFromImageFile(file) {
  const img = await loadImageFromFile(file)
  const { canvas, ctx } = createCanvas(img.width, img.height)
  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const code = jsQR(imageData.data, imageData.width, imageData.height)
  return code?.data || null
}

// Función interna que almacena las dimensiones del QR como Canvas
function createCanvas(w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  return { canvas, ctx }
}

// Funció interna que carga la imagen del QR desde un archivo (si no hay acceso a la cámara para la lectura de QR)
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e) }
    img.src = url
  })
}