// Layout raíz (Server Component): el HTML común de todas las páginas.
// El encabezado depende de la sesión del navegador, así que es un Client Component dentro de él.
import type { Metadata } from 'next'
// Tipografías servidas desde la propia app (sin depender de Google Fonts).
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/700.css'
import '@fontsource/figtree/400.css'
import '@fontsource/figtree/500.css'
import '@fontsource/figtree/600.css'
import './globals.css'
import { Encabezado } from '@/components/Encabezado'
import { Proveedores } from '@/components/Proveedores'

export const metadata: Metadata = {
  title: 'Pujaz, casa de subastas',
  description: 'Pujaz, casa de subastas en línea',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es">
      <body>
        <Proveedores>
          <Encabezado />
          <main className="layout-main">{children}</main>
        </Proveedores>
      </body>
    </html>
  )
}
