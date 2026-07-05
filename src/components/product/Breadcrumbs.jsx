import React from 'react'
import { Link } from 'react-router-dom'

// items = [{ label, to? }] — last item renders as plain text
const Breadcrumbs = ({ items }) => (
  <nav aria-label='Breadcrumb' className='flex flex-wrap items-center gap-1.5 text-xs text-ink-soft'>
    {items.map((item, i) => (
      <span key={i} className='flex items-center gap-1.5'>
        {i > 0 && <span className='text-line'>/</span>}
        {item.to ? (
          <Link to={item.to} className='hover:text-ink hover:underline'>{item.label}</Link>
        ) : (
          <span className='text-ink'>{item.label}</span>
        )}
      </span>
    ))}
  </nav>
)

export default Breadcrumbs
