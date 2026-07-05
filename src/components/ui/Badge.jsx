import React from 'react'

const variants = {
  bestseller: 'bg-ink text-white',
  new: 'bg-white text-ink border border-line',
  limited: 'bg-accent text-white',
  neutral: 'bg-cream-dark text-ink',
}

const Badge = ({ children, variant = 'neutral', className = '' }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-widest ${variants[variant] || variants.neutral} ${className}`}
  >
    {children}
  </span>
)

export default Badge
