// Tarjetas del listado. Componente de presentación: recibe los artículos ya cargados
// (en el servidor) y no tiene estado, así que se dibuja completo en el HTML.
import Link from 'next/link'
import type { ItemSummary } from '../api/items'
import { formatearPrecio, nombreEstado } from '../utils/formato'
import { ImagenLote } from './ImagenLote'

export function Catalogo({ items, busqueda }: { items: ItemSummary[]; busqueda: string }) {
  if (items.length === 0) {
    return (
      <p className="nota">
        {busqueda
          ? `No hay artículos que coincidan con «${busqueda}».`
          : 'Todavía no hay artículos en subasta.'}
      </p>
    )
  }

  return (
    <ul className="catalogo">
      {items.map((item) => (
        <li key={item.id} className="tarjeta-lote">
          <ImagenLote src={item.images[0]} alt="" nombre={item.name} />
          <div className="tarjeta-lote__cuerpo">
            {item.category && <p className="categoria">{item.category}</p>}
            <h2>
              <Link href={`/items/${item.id}`}>{item.name}</Link>
            </h2>
            <p className="tarjeta-lote__precio">
              {item.auction ? 'Precio actual' : 'Precio base'}
              <strong>{formatearPrecio(item.auction?.currentPrice ?? item.basePrice)}</strong>
            </p>
            {item.auction ? (
              <p className={`estado estado--${item.auction.status === 'OPEN' ? 'abierta' : 'cerrada'}`}>
                Subasta {nombreEstado(item.auction.status).toLowerCase()}
              </p>
            ) : (
              <p className="estado">Aún sin subasta</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
