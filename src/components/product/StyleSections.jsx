import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import { HeartIcon } from '../ui/Icons'

const styleIdeas = [
  { title: 'Formal Evening', text: 'Pair with tailored trousers and leather shoes for a sharp look.' },
  { title: 'Office Essential', text: 'Layer over a crisp shirt for polished 9-to-5 style.' },
  { title: 'Smart Casual', text: 'Wear with chinos and loafers for effortless sophistication.' },
]

// "How to Style It" — three looks built from related products' imagery.
export const HowToStyleIt = ({ category, subCategory, excludeId }) => {
  const { products, toggleWishlist, isInWishlist } = useContext(ShopContext)

  const looks = products
    .filter(p => p._id !== excludeId && p.category === category && p.subCategory === subCategory)
    .slice(0, 3)

  if (looks.length < 3) return null

  return (
    <section className='py-12'>
      <h2 className='text-center font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>How to Style It</h2>
      <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6'>
        {looks.map((product, i) => (
          <div key={product._id} className='group relative overflow-hidden rounded-2xl border border-line bg-white'>
            <Link to={`/product/${product._id}`} className='block aspect-[4/5] overflow-hidden'>
              <img src={product.image?.[0]} alt={styleIdeas[i].title} loading='lazy' className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105' />
            </Link>
            <button
              type='button'
              aria-label='Add to wishlist'
              onClick={() => toggleWishlist(product._id)}
              className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white/90 cursor-pointer ${isInWishlist(product._id) ? 'text-red-500' : 'text-ink hover:text-red-500'}`}
            >
              <HeartIcon className='w-4 h-4' filled={isInWishlist(product._id)} />
            </button>
            <div className='p-4'>
              <p className='text-sm font-medium text-ink'>{styleIdeas[i].title}</p>
              <p className='mt-1 text-xs leading-relaxed text-ink-soft'>{styleIdeas[i].text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const craftDetails = [
  { title: 'Premium Fabric', text: 'Warm, soft & durable' },
  { title: 'Refined Details', text: 'Quality buttons & stitching' },
  { title: 'Structured Fit', text: 'Sharp shoulders & clean lines' },
]

// "Crafted With Intention" — detail shots from the product's own gallery.
export const CraftedWithIntention = ({ images = [] }) => {
  const shots = images.slice(1, 4)
  if (shots.length === 0) return null

  return (
    <section className='py-6'>
      <div className='grid grid-cols-1 gap-6 rounded-2xl bg-cream-dark p-6 sm:p-8 lg:grid-cols-[1fr_2.4fr]'>
        <div className='flex flex-col justify-center gap-3'>
          <h2 className='font-display text-xl font-medium tracking-tight text-ink sm:text-2xl'>Crafted With Intention</h2>
          <p className='text-sm leading-relaxed text-ink-soft'>
            Every detail is considered. From refined stitching to breathable linings, our pieces are made to look sharp and last longer.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {shots.map((src, i) => (
            <div key={i}>
              <div className='overflow-hidden rounded-xl'>
                <img src={src} alt={craftDetails[i]?.title || 'Detail'} loading='lazy' className='aspect-[4/3] w-full object-cover' />
              </div>
              {craftDetails[i] && (
                <>
                  <p className='mt-3 text-sm font-medium text-ink'>{craftDetails[i].title}</p>
                  <p className='text-xs text-ink-soft'>{craftDetails[i].text}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
