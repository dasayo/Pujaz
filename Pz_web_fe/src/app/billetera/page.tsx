// Mi billetera (exige sesión). RutaPrivada manda a /login si no hay sesión.
import type { Metadata } from 'next'
import { BilleteraUsuario } from '@/components/BilleteraUsuario'
import { RutaPrivada } from '@/components/RutaPrivada'

export const metadata: Metadata = { title: 'Mi billetera · Pujaz' }

export default function BilleteraPage() {
  return (
    <RutaPrivada>
      <BilleteraUsuario />
    </RutaPrivada>
  )
}
