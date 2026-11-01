'use client'
// Protege las páginas que exigen sesión: sin sesión, manda a /login?desde=<esta página>
// y después del login se regresa aquí.
// KAN-66 (Heider): con la cookie httpOnly esta revisión puede hacerse en el servidor
// (redirect() de next/navigation en la página) y este componente deja de hacer falta.
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'
import { useSesion } from '../session/SessionContext'

export function RutaPrivada({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useSesion()
  const ruta = usePathname()
  const router = useRouter()
  // Si la sesión se cierra estando aquí (botón «Cerrar sesión» o cuenta eliminada), quien la cerró
  // ya está navegando a otra página: no hay que mandar a /login.
  const huboUsuario = useRef(false)

  useEffect(() => {
    if (cargando) return
    if (usuario) {
      huboUsuario.current = true
      return
    }
    if (!huboUsuario.current) {
      router.replace(`/login?desde=${encodeURIComponent(ruta)}`)
    }
  }, [cargando, usuario, ruta, router])

  if (cargando || !usuario) return <p className="nota">Cargando…</p>
  return <>{children}</>
}
