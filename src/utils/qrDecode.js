// Importación de componente para lecturas de QRs
import jsQR from 'jsqr'

// Función que permite decodificar un QR de forma asíncrona desde una imagen
export async function decodeQrFromImageFile(file) {
  const img = await loadImageFromFile(file)
  const { canvas, ctx } = createCanvas(img.width, img.height)
  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const code = jsQR(imageData.data, imageData.width, imageData.height)
  return code?.data || null
}

// Función que decodifica QRs en tiempo real desde la cámara del dispositivo
export async function startQrScanner(videoElement, onResult) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  videoElement.srcObject = stream
  // Línea necesaria para iOS
  videoElement.setAttribute('playsinline', true)
  await videoElement.play()

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  const scan = () => {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        stopQrScanner(videoElement)
        onResult(code.data)
        return
      }
    }
    requestAnimationFrame(scan)
  }

  scan()
}

// Función interna que detiene la cámara
export function stopQrScanner(videoElement) {
  const stream = videoElement.srcObject
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    videoElement.srcObject = null
  }
}

// Función interna que almacena las dimensiones del QR como Canvas
function createCanvas(w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  return { canvas, ctx }
}

// Función interna que carga la imagen del QR desde un archivo (si no hay acceso a la cámara para la lectura de QR)
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e) }
    img.src = url
  })
}