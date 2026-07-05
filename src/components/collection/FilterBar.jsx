import React, { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '../ui/Icons'

export const PRICE_RANGES = [
  { label: 'Under Rs. 5,000', min: 0, max: 5000 },
  { label: 'Rs. 5,000 – 10,000', min: 5000, max: 10000 },
  { label: 'Rs. 10,000 – 20,000', min: 10000, max: 20000 },
  { label: 'Over Rs. 20,000', min: 20000, max: Infinity },
]

// Dropdown popover with checkbox options. Closes on outside click.
const FilterDropdown = ({ label, options, selected, onToggle }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const activeCount = selected.length

  return (
    <div className='relative' ref={ref}>
      <button
        type='button'
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${activeCount ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'}`}
      >
        {label}{activeCount > 0 && ` (${activeCount})`}
        <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className='absolute left-0 top-full z-20 mt-2 max-h-64 w-48 overflow-y-auto rounded-xl border border-line bg-white p-3 shadow-md'>
          {options.map(option => (
            <label key={option} className='flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-cream'>
              <input
                type='checkbox'
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className='accent-black'
              />
              {option}
            </label>
          ))}
          {options.length === 0 && <p className='px-2 py-1.5 text-xs text-ink-soft'>No options</p>}
        </div>
      )}
    </div>
  )
}

/**
 * Controlled filter bar. `filters` = { categories: [], sizes: [], colors: [],
 * prices: [] (labels), inStock: bool }; `options` supplies the derived
 * size/color lists.
 */
const FilterBar = ({ filters, setFilters, options, sortType, setSortType }) => {
  const toggle = (key) => (value) =>
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }))

  const hasActive = filters.categories.length || filters.sizes.length || filters.colors.length || filters.prices.length || filters.inStock

  return (
    <div className='flex flex-wrap items-center gap-2.5'>
      <FilterDropdown label='Category' options={options.categories} selected={filters.categories} onToggle={toggle('categories')} />
      <FilterDropdown label='Size' options={options.sizes} selected={filters.sizes} onToggle={toggle('sizes')} />
      <FilterDropdown label='Color' options={options.colors} selected={filters.colors} onToggle={toggle('colors')} />
      <FilterDropdown label='Price' options={PRICE_RANGES.map(r => r.label)} selected={filters.prices} onToggle={toggle('prices')} />

      <label className='flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-medium text-ink'>
        In Stock
        <span className={`relative inline-block h-4 w-8 rounded-full transition-colors ${filters.inStock ? 'bg-ink' : 'bg-line'}`}>
          <input
            type='checkbox'
            checked={filters.inStock}
            onChange={() => setFilters(prev => ({ ...prev, inStock: !prev.inStock }))}
            className='absolute inset-0 cursor-pointer opacity-0'
          />
          <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${filters.inStock ? 'left-4.5' : 'left-0.5'}`} />
        </span>
      </label>

      {hasActive ? (
        <button
          type='button'
          onClick={() => setFilters({ categories: [], sizes: [], colors: [], prices: [], inStock: false })}
          className='text-xs text-ink-soft underline underline-offset-4 hover:text-ink cursor-pointer'
        >
          Clear all
        </button>
      ) : null}

      <div className='ml-auto'>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className='cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-xs font-medium text-ink outline-none'
        >
          <option value='newest'>Sort by: Newest</option>
          <option value='low-high'>Price: Low to High</option>
          <option value='high-low'>Price: High to Low</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar
