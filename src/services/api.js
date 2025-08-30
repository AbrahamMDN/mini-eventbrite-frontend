/* Endpoints de la API */

// No es necesario el .js porque se está trabajando en Vite y no en Express
import http from "./http";

// Función de registro de usuario
export async function register({name, email, password, role}) {
    // No se coloca /api porque ya está en la URL de la variable de entorno
    const { data } = await http.post('/auth/register',{name, email, password, role})
    return data
}

// Función de inicio de sesión de usuario
export async function login({email, password}) {
    const { data } = await http.post('/auth/login',{email, password})
    return data
}

// Función de recuperación de información de un usuario 
export async function me() {
    const { data } = await http.post('/auth/me')
    return data
}

// Función que muestra la lista de eventos
export async function listEvents() {
    const { data } = await http.get('/events')
    return data
}

// Función que trae un evento por su ID
export async function getEvent(id) {
    const { data } = await http.get(`/events/${id}`)
    return data
}

// Función que crea un evento a partir de un payload
export async function createEvent(payload) {
    const { data } = await http.post('/events',payload)
    return data
}

// Función que simula la compra de un ticket de un evento
export async function purchaseTicket({eventId, set}) {
    const { data } = await http.post('/tickets/purchase',{eventId, set})
    return data
}

// Función que simula el escaneo de un ticket por su token
export async function scanTicket({token}) {
    const { data } = await http.post('/checkin/scan',{token})
    return data
}