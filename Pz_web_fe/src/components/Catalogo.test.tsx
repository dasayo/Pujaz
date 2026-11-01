// Tarjetas del listado (lo que dibuja el servidor con los artículos que trae el gateway).
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ItemSummary } from '../api/items'
import { Catalogo } from './Catalogo'

const reloj = {
  id: '1',
  name: 'Reloj antiguo',
  category: 'Relojería',
  images: [],
  basePrice: 100000,
  auction: { id: 'a1', currentPrice: 150000, status: 'OPEN', endsAt: '2026-10-20T15:00:00Z' },
} as ItemSummary

const lampara = {
  id: '2',
  name: 'Lámpara de bronce',
  category: null,
  images: [],
  basePrice: 80000,
  auction: null,
} as ItemSummary

describe('Catalogo', () => {
  it('muestra cada artículo con su enlace, precio y estado', () => {
    render(<Catalogo items={[reloj, lampara]} busqueda="" />)
    expect(screen.getByRole('link', { name: 'Reloj antiguo' })).toHaveAttribute('href', '/items/1')
    expect(screen.getByText('Relojería')).toBeInTheDocument()
    expect(screen.getByText('Precio actual')).toHaveTextContent('$ 150.000')
    expect(screen.getByText('Subasta abierta')).toBeInTheDocument()
    expect(screen.getByText('Precio base')).toHaveTextContent('$ 80.000')
    expect(screen.getByText('Aún sin subasta')).toBeInTheDocument()
  })

  it('avisa cuando no hay artículos', () => {
    render(<Catalogo items={[]} busqueda="" />)
    expect(screen.getByText('Todavía no hay artículos en subasta.')).toBeInTheDocument()
  })

  it('avisa cuando la búsqueda no encontró nada', () => {
    render(<Catalogo items={[]} busqueda="jarrón" />)
    expect(screen.getByText('No hay artículos que coincidan con «jarrón».')).toBeInTheDocument()
  })
})
