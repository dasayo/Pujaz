'use client'
// Publicar un artículo (mutation createItem). Al terminar lleva al detalle del artículo nuevo.
import { useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { mensajeErrorServidor } from '../api/errores'
import { CREATE_ITEM } from '../api/items'

export function FormularioPublicar() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [crear, { loading }] = useMutation(CREATE_ITEM)

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setError(null)

    const fd = new FormData(evento.currentTarget)
    const name = fd.get('name') as string
    const description = fd.get('description') as string
    const category = fd.get('category') as string
    const imageUrl = fd.get('imageUrl') as string
    const basePrice = Number(fd.get('basePrice'))
    // El campo datetime-local da la hora local; el contrato la espera en ISO.
    const endsAtRaw = fd.get('endsAt') as string
    const endsAt = endsAtRaw ? new Date(endsAtRaw).toISOString() : undefined

    try {
      const { data } = await crear({
        variables: {
          input: {
            name,
            description: description || undefined,
            category: category || undefined,
            images: imageUrl ? [imageUrl] : [],
            basePrice,
            endsAt,
          },
        },
      })
      // El detalle (y luego el listado) se piden de nuevo al servidor, así que ya incluyen la pieza.
      if (data?.createItem) router.push(`/items/${data.createItem.id}`)
    } catch (e) {
      setError(mensajeErrorServidor(e))
    }
  }

  return (
    <section className="pagina-angosta">
      <h1>Publicar artículo</h1>
      <p>Añade un nuevo artículo para que la comunidad empiece a pujar de inmediato.</p>

      {error && (
        <div role="alert" className="mensaje-error">
          {error}
        </div>
      )}

      <form className="formulario" onSubmit={enviar}>
        <label htmlFor="name">Nombre del artículo</label>
        <input id="name" name="name" type="text" required autoFocus placeholder="Ej: Reloj de Oro" />

        <label htmlFor="description">Descripción</label>
        <textarea id="description" name="description" rows={3} placeholder="Breve historia, detalles o estado del ítem..." />

        <label htmlFor="category">Categoría</label>
        <input id="category" name="category" type="text" placeholder="Ej: Antigüedades, Arte, Relojería" />

        <label htmlFor="imageUrl">URL de la imagen (opcional)</label>
        <input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />

        <label htmlFor="basePrice">Precio base de subasta ($ COP)</label>
        <input id="basePrice" name="basePrice" type="number" required min="1000" step="1000" defaultValue="50000" />

        <label htmlFor="endsAt">Fecha de cierre (opcional)</label>
        <input id="endsAt" name="endsAt" type="datetime-local" />
        <small style={{ color: 'var(--gris)', marginTop: '-4px' }}>
          Si lo dejas vacío, el sistema asignará una duración por defecto.
        </small>

        <button type="submit" disabled={loading} style={{ marginTop: '24px' }}>
          {loading ? 'Publicando...' : 'Publicar artículo'}
        </button>
      </form>
    </section>
  )
}
