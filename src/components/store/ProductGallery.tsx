'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: Array<{ id: string; url: string; is_primary: boolean }>
  productName: string
}

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0)

  if (!images.length) {
    return (
      <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg3)' }}>
        Sem imagem
      </div>
    )
  }

  return (
    <div>
      {/* Main image */}
      <div style={{ position: 'relative', background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, aspectRatio: '1', overflow: 'hidden', marginBottom: 12 }}>
        <Image
          src={images[active].url}
          alt={productName}
          fill
          style={{ objectFit: 'contain', padding: 16 }}
          sizes="(max-width: 768px) 100vw, 600px"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              style={{
                width: 72, height: 72, padding: 0, border: `2px solid ${i === active ? 'var(--bg-accent)' : 'var(--hair)'}`,
                borderRadius: 2, background: 'var(--surf-2)', cursor: 'pointer', overflow: 'hidden', position: 'relative', flexShrink: 0,
              }}
            >
              <Image
                src={img.url}
                alt={`${productName} ${i + 1}`}
                fill
                style={{ objectFit: 'contain', padding: 4 }}
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
