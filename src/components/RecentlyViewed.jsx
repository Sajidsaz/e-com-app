import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Container from './ui/Container'

// Compact "Recently Viewed" row (Collection + Product pages). Hidden until
// the visitor has opened at least one product.
const RecentlyViewed = ({ excludeId }) => {
  const { products, recentlyViewed, formatPrice } = useContext(ShopContext)

  const items = recentlyViewed
    .filter(id => id !== excludeId)
    .map(id => products.find(p => p._id === id))
    .filter(Boolean)
    .slice(0, 5)

  if (items.length === 0) return null

  return (
    <Container className='py-10'>
      <h2 className='font-display text-xl font-medium tracking-tight text-ink sm:text-2xl'>Recently Viewed</h2>
      <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
        {items.map(product => (
          <Link key={product._id} to={`/product/${product._id}`} className='group flex items-center gap-3 rounded-xl border border-line bg-white p-2.5'>
            <div className='h-16 w-14 shrink-0 overflow-hidden rounded-lg'>
              <img src={product.image?.[0]} alt={product.name} loading='lazy' className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105' />
            </div>
            <div className='min-w-0'>
              <p className='truncate text-xs font-medium text-ink'>{product.name}</p>
              <p className='text-xs text-ink-soft'>{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export default RecentlyViewed
