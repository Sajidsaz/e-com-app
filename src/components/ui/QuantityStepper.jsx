import React from 'react'

/**
 * Minus / value / plus stepper. Clamped to [min, max]; `onChange` receives
 * the next quantity.
 */
const QuantityStepper = ({ value = 1, min = 1, max = 99, onChange, className = '' }) => (
  <div className={`inline-flex items-center rounded-full border border-line bg-white ${className}`}>
    <button
      type='button'
      aria-label='Decrease quantity'
      disabled={value <= min}
      onClick={() => onChange?.(Math.max(min, value - 1))}
      className='px-4 py-2 text-lg leading-none text-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed'
    >
      −
    </button>
    <span className='min-w-8 text-center text-sm font-medium'>{value}</span>
    <button
      type='button'
      aria-label='Increase quantity'
      disabled={value >= max}
      onClick={() => onChange?.(Math.min(max, value + 1))}
      className='px-4 py-2 text-lg leading-none text-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed'
    >
      +
    </button>
  </div>
)

export default QuantityStepper
