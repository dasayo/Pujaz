// Publicar artículo (exige sesión). RutaPrivada manda a /login si no hay sesión.
import type { Metadata } from 'next'
import { FormularioPublicar } from '@/components/FormularioPublicar'
import { RutaPrivada } from '@/components/RutaPrivada'

export const metadata: Metadata = { title: 'Publicar artículo · Pujaz' }

export default function PublicarPage() {
  return (
    <RutaPrivada>
      <FormularioPublicar />
    </RutaPrivada>
  )
}
