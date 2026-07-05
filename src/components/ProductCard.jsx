import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShopContext } from '../context/ShopContext'
import Badge from './ui/Badge'
import StarRating from './ui/StarRating'
import { HeartIcon } from './ui/Icons'
import { ArrowIcon } from './ui/Button'

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

// Badge precedence: Bestseller > New (added in the last 30 days) > Limited
// (3 or fewer items left across all variants).
const getBadge = (product) => {
  if (product.bestseller) return { label: 'Bestseller', variant: 'bestseller' }
  if (product.date && Date.now() - product.date < THIRTY_DAYS) return { label: 'New', variant: 'new' }
  const totalStock = (product.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0)
  if (totalStock > 0 && totalStock <= 3) return { label: 'Limited', variant: 'limited' }
  return null
}

// `index` staggers the scroll reveal within a grid row (object-form animation
// on purpose — named variants would leak into children like StarRating).
const ProductCard = ({ product, index = 0 }) => {
  const { formatPrice, toggleWishlist, isInWishlist } = useContext(ShopContext)

  if (!product) return null

  const badge = getBadge(product)
  const colorCount = new Set((product.variants || []).map(v => v.color)).size
  const wishlisted = isInWishlist(product._id)
  const rating = product.rating || { average: 0, count: 0 }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: (index % 4) * 0.08 }}
      className='group flex flex-col'
    >
      <div className='relative overflow-hidden rounded-xl border border-line bg-white'>
        <Link to={`/product/${product._id}`} data-cursor='view' className='block aspect-[3/4] overflow-hidden'>
          <img
            src={product.image?.[0]}
            alt={product.name}
            loading='lazy'
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        </Link>
        {badge && (
          <div className='absolute left-3 top-3'>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
        )}
        <button
          type='button'
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => toggleWishlist(product._id)}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white/90 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 ${wishlisted ? 'text-red-500' : 'text-ink hover:text-red-500'}`}
        >
          <HeartIcon className='w-4 h-4' filled={wishlisted} />
        </button>
      </div>

      <div className='flex flex-col gap-1 px-1 pt-3'>
        <Link to={`/product/${product._id}`} className='text-sm font-medium text-ink hover:underline'>
          {product.name}
        </Link>
        {colorCount > 0 && (
          <p className='text-xs text-ink-soft'>{colorCount} {colorCount === 1 ? 'Color' : 'Colors'}</p>
        )}
        <p className='text-sm font-semibold text-ink'>{formatPrice(product.price)}</p>
        {rating.count > 0 && <StarRating rating={rating.average} count={rating.count} showValue />}
      </div>

      {/* Variants require a color+size choice, so the card CTA opens the product page */}
      <Link
        to={`/product/${product._id}`}
        className='group/cta mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-medium tracking-wide text-white transition-colors hover:bg-black'
      >
        Add to Cart
        <ArrowIcon className='w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-1' />
      </Link>
    </motion.div>
  )
}

export default ProductCard
