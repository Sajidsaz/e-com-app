import React from 'react'

/**
 * Standard section heading: optional small uppercase eyebrow, display
 * heading, optional subtitle. `align` = 'center' | 'left'.
 */
const SectionHeading = ({ eyebrow, title, subtitle, align = 'center', className = '' }) => {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  return (
    <div className={`flex flex-col gap-2 ${alignCls} ${className}`}>
      {eyebrow && (
        <p className='text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft'>{eyebrow}</p>
      )}
      <h2 className='font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-ink'>{title}</h2>
      {subtitle && <p className='max-w-xl text-sm sm:text-base text-ink-soft'>{subtitle}</p>}
    </div>
  )
}

export default SectionHeading
