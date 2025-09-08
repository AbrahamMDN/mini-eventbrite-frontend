// Función para seleccionar asientos
export default function SeatGrid({ rows, cols, occupied = [], selected, onSelect }) {
    // Acción si el asiento ya está ocupado
  const isOcc = (r, c) => occupied.some(s => Number(s.row) === r && Number(s.col) === c)

  // Mapa de asientos
  const cells = []
  // Ciclo for para crear el arreglo matricial
  for (let r = 1; r <= rows; r++) {
    const rowCells = []
    for (let c = 1; c <= cols; c++) {
      const occ = isOcc(r, c)
      const sel = selected && selected.row === r && selected.col === c
      rowCells.push(
        // Cada asiento individual se representa como un botón
        // El estilo del asiento cambia según si está seleccionado, ocupado o con el cursor sobre él
        <button
          key={`${r}-${c}`}
          disabled={occ}
          onClick={() => onSelect({ row: r, col: c })}
          className={[
            'w-9 h-9 rounded-md text-xs flex items-center justify-center border',
            occ
              ? 'bg-slate-300 dark:bg-slate-800 border-slate-400 dark:border-slate-700 cursor-not-allowed opacity-60'
              : sel
              ? 'bg-brand text-white border-brand-dark'
              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
          ].join(' ')}
          title={`Fila ${r}, Col ${c}${occ ? ' (ocupado)' : ''}`}
        >
          {r}-{c}
        </button>
      )
    }
    // Se actualiza el mapa de asientos tras cambios de estilos por la selección
    cells.push(<div className="flex gap-2" key={r}>{rowCells}</div>)
  }

  return <div className="flex flex-col gap-2">{cells}</div>
}