'use client'
// Foto de una pieza. Si no hay foto o no carga, muestra un marco vacío con la inicial,
// para que el catálogo no quede con huecos.
import { useState } from 'react'

interface Props {
  src?: string
  alt: string
  nombre: string
  className?: string
}

export function ImagenLote({ src, alt, nombre, className = '' }: Props) {
  const [fallo, setFallo] = useState(false)

  if (!src || fallo) {
    return (
      <div className={`imagen-lote imagen-lote--vacia ${className}`} aria-hidden="true">
        <span>{nombre.charAt(0)}</span>
      </div>
    )
  }

  // <img> normal y no next/image: las fotos vienen de cualquier URL que ponga quien publica.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`imagen-lote ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  )
}
