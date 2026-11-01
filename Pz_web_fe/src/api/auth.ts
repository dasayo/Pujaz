// Guarda y lee el JWT que devuelve la mutation `login`.
// Por ahora vive en localStorage, como en la SPA. En KAN-66 (Heider) pasa a una cookie httpOnly
// para que el servidor de Next.js también pueda usarlo; cuando eso pase, solo cambia este archivo
// y el proveedor de sesión.
//
// Está escrito como un "almacén externo" (useSyncExternalStore): en el servidor no hay
// localStorage, así que allá el token siempre es null y el navegador lo lee al hidratar.
const TOKEN_KEY = 'pujaz_token'

const oyentes = new Set<() => void>()

function avisar(): void {
  for (const oyente of oyentes) oyente()
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token)
  avisar()
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY)
  avisar()
}

// Para useSyncExternalStore: avisa cuando el token cambia en esta pestaña o en otra.
export function suscribirToken(oyente: () => void): () => void {
  oyentes.add(oyente)
  window.addEventListener('storage', oyente)
  return () => {
    oyentes.delete(oyente)
    window.removeEventListener('storage', oyente)
  }
}

// En el servidor (y al hidratar) se dibuja como si no hubiera sesión.
export function tokenEnServidor(): string | null {
  return null
}
