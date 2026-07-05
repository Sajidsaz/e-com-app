import React, { useRef } from 'react'

const ArrowIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <line x1='4' y1='12' x2='20' y2='12' />
    <polyline points='13 5 20 12 13 19' />
  </svg>
)

const variants = {
  primary: 'bg-ink text-white hover:bg-black border border-ink',
  outline: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-white',
  ghost: 'bg-transparent text-ink border border-transparent hover:border-line',
  light: 'bg-white text-ink border border-line hover:border-ink',
}

const sizes = {
  sm: 'text-xs px-4 py-2 gap-2',
  md: 'text-sm px-6 py-2.5 gap-2.5',
  lg: 'text-sm sm:text-base px-8 py-3 gap-3',
}

// Subtle magnetic pull toward the cursor (a few px, desktop-only detail —
// mouse events don't fire on touch). Resets on leave.
const MAGNET_STRENGTH = 0.15
const MAGNET_MAX = 4

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  className = '',
  as: Tag = 'button',
  ...props
}) => {
  const ref = useRef(null)

  const onMouseMove = (e) => {
    const el = ref.current
    if (!el || props.disabled) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH
    const dy = (e.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH
    const clamp = (v) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v))
    el.style.transform = `translate(${clamp(dx)}px, ${clamp(dy)}px)`
  }

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group inline-flex items-center justify-center rounded-full font-medium tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {arrow && <ArrowIcon className='w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1' />}
    </Tag>
  )
}

export { ArrowIcon }
export default Button
