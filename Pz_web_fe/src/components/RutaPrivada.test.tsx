// Páginas privadas: sin sesión mandan a iniciar sesión y recuerdan de dónde venía.
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { navegacion } from '../test/navegacion'
import { ana, renderConSesion } from '../test/render'
import { RutaPrivada } from './RutaPrivada'

describe('RutaPrivada', () => {
  it('sin sesión manda a /login?desde=<la página>', async () => {
    renderConSesion(<RutaPrivada>contenido privado</RutaPrivada>, { ruta: '/billetera' })
    await waitFor(() => expect(navegacion.replace).toHaveBeenCalledWith('/login?desde=%2Fbilletera'))
    expect(screen.queryByText('contenido privado')).not.toBeInTheDocument()
  })

  it('con sesión muestra la página', async () => {
    renderConSesion(<RutaPrivada>contenido privado</RutaPrivada>, { ruta: '/billetera', conSesion: ana })
    expect(await screen.findByText('contenido privado')).toBeInTheDocument()
    expect(navegacion.replace).not.toHaveBeenCalled()
  })
})
