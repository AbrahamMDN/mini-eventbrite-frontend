// Esquema para un Botón
export default function Button({children, className='', ...props}){
    return(
        <button className={`btn btn-primary ${className}`} {...props}>
            {children}
        </button>
    )
}