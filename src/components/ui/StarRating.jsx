import React from 'react'
import { motion } from 'framer-motion'

// Used when `animated` is set: stars pop in one by one, driven by a parent
// with matching 'hidden'/'show' variants and staggerChildren.
const starVariant = {
  hidden: { opacity: 0, scale: 0.4 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
}

const Star = ({ fill = 1, size }) => {
  // fill: 0..1 fraction of the star painted
  const id = React.useId()
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' aria-hidden='true'>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor='currentColor' />
          <stop offset={`${fill * 100}%`} stopColor='transparent' />
        </linearGradient>
      </defs>
      <path
        d='M12 2.5l2.95 6.09 6.55.9-4.8 4.6 1.2 6.55L12 17.5l-5.9 3.14 1.2-6.55-4.8-4.6 6.55-.9L12 2.5z'
        fill={`url(#${id})`}
        stroke='currentColor'
        strokeWidth='1.2'
      />
    </svg>
  )
}

/**
 * Star rating row. `rating` 0-5 (supports fractions), optional `count`
 * renders "(n)" after the stars, `showValue` prefixes the numeric rating.
 * `animated` makes stars appear one by one under a parent variant stagger.
 */
const StarRating = ({ rating = 0, count, showValue = false, size = 14, animated = false, className = '' }) => {
  const safe = Math.max(0, Math.min(5, Number(rating) || 0))
  const StarWrap = animated ? motion.span : 'span'
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className='flex items-center gap-0.5 text-ink'>
        {[0, 1, 2, 3, 4].map((i) => (
          <StarWrap key={i} {...(animated ? { variants: starVariant } : {})} className='flex'>
            <Star size={size} fill={Math.max(0, Math.min(1, safe - i))} />
          </StarWrap>
        ))}
      </div>
      {showValue && <span className='text-xs text-ink font-medium'>{safe.toFixed(1)}</span>}
      {count !== undefined && count !== null && (
        <span className='text-xs text-ink-soft'>({count})</span>
      )}
    </div>
  )
}

export default StarRating
