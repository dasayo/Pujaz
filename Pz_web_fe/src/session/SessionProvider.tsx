'use client'
// Guarda la sesión: el JWT queda en el navegador y el usuario se pide con `me`.
// En el servidor no hay sesión (no hay localStorage): las partes privadas se dibujan al hidratar.
// KAN-66 (Heider) cambia esto a cookie httpOnly para que el servidor sepa quién está conectado.
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useCallback, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { clearToken, getToken, saveToken, suscribirToken, tokenEnServidor } from '../api/auth'
import { codigoError } from '../api/errores'
import { ME, type AuthPayload } from '../api/usuarios'
import { SessionContext, type Sesion } from './SessionContext'

// false en el servidor y al hidratar; true cuando ya se puede leer el token del navegador.
function sinSuscripcion() {
  return () => {}
}
export function useHidratado(): boolean {
  return useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  )
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient()
  const token = useSyncExternalStore(suscribirToken, getToken, tokenEnServidor)
  const hidratado = useHidratado()

  // Solo se pregunta `me` si hay un token guardado.
  const { data, loading, error } = useQuery(ME, { skip: !token })

  // Si el token venció o no es válido, se trata como sesión cerrada.
  const tokenInvalido = codigoError(error) === 'UNAUTHENTICATED'
  const usuario = token && !tokenInvalido ? (data?.me ?? null) : null

  const iniciarSesion = useCallback(
    ({ token: nuevoToken, user }: AuthPayload) => {
      // Se guarda el usuario en la caché antes del token para no volver a pedirlo.
      client.writeQuery({ query: ME, data: { me: user } })
      saveToken(nuevoToken)
    },
    [client],
  )

  const cerrarSesion = useCallback(() => {
    clearToken()
    // Borra de la caché los datos privados (billetera, perfil).
    void client.clearStore()
  }, [client])

  const sesion = useMemo<Sesion>(
    () => ({
      usuario,
      // Mientras no se haya hidratado, todavía no se sabe si hay sesión.
      cargando: !hidratado || (Boolean(token) && loading),
      iniciarSesion,
      cerrarSesion,
    }),
    [usuario, hidratado, token, loading, iniciarSesion, cerrarSesion],
  )

  return <SessionContext.Provider value={sesion}>{children}</SessionContext.Provider>
}
