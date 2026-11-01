// Listado de artículos en subasta con buscador (Server Component).
// El encabezado y el buscador salen de inmediato; los artículos se piden al gateway en el
// servidor y llegan en el mismo HTML apenas estén (streaming con <Suspense>).
import { Suspense } from 'react'
import { Buscador } from '@/components/Buscador'
import { Catalogo } from '@/components/Catalogo'
import { ErrorCarga } from '@/components/ErrorCarga'
import { obtenerItems } from '@/lib/datos'

function textoBusqueda(q: string | string[] | undefined): string {
  return (Array.isArray(q) ? q[0] : (q ?? '')).trim()
}

async function Resultados({ searchParams }: { searchParams: PageProps<'/'>['searchParams'] }) {
  const busqueda = textoBusqueda((await searchParams).q)
  let items
  try {
    items = await obtenerItems(busqueda)
  } catch {
    const href = busqueda ? `/?q=${encodeURIComponent(busqueda)}` : '/'
    return <ErrorCarga mensaje="No se pudieron cargar los artículos. Intenta de nuevo en un momento." href={href} />
  }
  return (
    <>
      <Buscador valor={busqueda} />
      <Catalogo items={items} busqueda={busqueda} />
    </>
  )
}

export default function ListadoPage({ searchParams }: PageProps<'/'>) {
  return (
    <section className="listado">
      <header className="encabezado-pagina">
        <h1>Subastas</h1>
        <p className="entradilla">Piezas abiertas a puja. Entra a cada una para ver su historia y ofertar.</p>
      </header>
      <Suspense
        fallback={
          <>
            <Buscador valor="" />
            <p className="nota">Cargando artículos…</p>
          </>
        }
      >
        <Resultados searchParams={searchParams} />
      </Suspense>
    </section>
  )
}
