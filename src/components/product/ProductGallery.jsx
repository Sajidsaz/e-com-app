import React, { useRef, useState } from 'react'
import { ZoomIcon } from '../ui/Icons'

/**
 * Vertical thumbnails (desktop) / horizontal strip (mobile) + main image
 * with cursor-tracked hover zoom and an image counter.
 */
const ProductGallery = ({ images = [], name = '' }) => {
  const [index, setIndex] = useState(0)
  const [zooming, setZooming] = useState(false)
  const mainRef = useRef(null)

  const onMouseMove = (e) => {
    const el = mainRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.transformOrigin = `${x}% ${y}%`
  }

  if (images.length === 0) return null

  return (
    <div className='flex flex-col-reverse gap-3 sm:flex-row'>

      {/* Thumbnails */}
      <div className='flex gap-3 overflow-x-auto sm:max-h-[560px] sm:w-20 sm:flex-col sm:overflow-y-auto'>
        {images.map((src, i) => (
          <button
            key={i}
            type='button'
            onClick={() => setIndex(i)}
            aria-label={`View image ${i + 1}`}
            className={`w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border transition-colors sm:w-full ${i === index ? 'border-ink' : 'border-line hover:border-ink-soft'}`}
          >
            <img src={src} alt='' className='aspect-[3/4] w-full object-cover' />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        data-cursor='zoom'
        className='relative flex-1 cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-white'
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={onMouseMove}
      >
        <img
          ref={mainRef}
          src={images[index]}
          alt={name}
          className={`aspect-[3/4] w-full object-cover transition-transform duration-200 ${zooming ? 'scale-150' : 'scale-100'}`}
        />
        <span className='pointer-events-none absolute right-3 top-3 rounded-full border border-line bg-white/90 p-2 text-ink'>
          <ZoomIcon className='w-4 h-4' />
        </span>
        <span className='pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] text-white'>
          {index + 1} / {images.length}
        </span>
      </div>

    </div>
  )
}

export default ProductGallery
