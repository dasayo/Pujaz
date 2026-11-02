// Mi perfil (exige sesión). RutaPrivada manda a /login si no hay sesión.
import type { Metadata } from 'next'
import { PerfilUsuario } from '@/components/PerfilUsuario'
import { RutaPrivada } from '@/components/RutaPrivada'

export const metadata: Metadata = { title: 'Mi perfil · Pujaz' }

export default function PerfilPage() {
  return (
    <RutaPrivada>
      <PerfilUsuario />
    </RutaPrivada>
  )
}
