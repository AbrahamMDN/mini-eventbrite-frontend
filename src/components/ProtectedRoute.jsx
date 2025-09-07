import { Navigate, useLocation } from "react-router-dom"; 
import useAuth from "../hooks/useAuth";

// Función para acceso a Rutas Protegidas por Autorización
export default function ProtectedRoute({children}){
    const { isAuthenticated } = useAuth()
    const location = useLocation()

    if (!isAuthenticated()) {
        // Si el usuario no está autenticado, se redirige al inicio desde el sitio inaccesible
        return <Navigate to="/" state={{from: location}} replace />
    }
    return children
}