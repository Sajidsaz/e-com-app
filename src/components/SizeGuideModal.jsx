import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseIcon } from './ui/Icons'
import { sizeGuide, measurementTips } from '../data/sizeGuide'

/**
 * Shared size-guide modal (Product page + Contact CTA). `category` picks the
 * table; omit it to show every table.
 */
const SizeGuideModal = ({ open, onClose, category }) => {
  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const entries = category && sizeGuide[category]
    ? [[category, sizeGuide[category]]]
    : Object.entries(sizeGuide)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className='max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 sm:p-8'
          >
            <div className='flex items-center justify-between'>
              <h2 className='font-display text-xl font-medium text-ink'>Size Guide</h2>
              <button type='button' aria-label='Close size guide' onClick={onClose} className='cursor-pointer text-ink-soft hover:text-ink'>
                <CloseIcon />
              </button>
            </div>

            {entries.map(([name, table]) => (
              <div key={name} className='mt-6'>
                <p className='mb-3 text-sm font-medium text-ink'>{name}</p>
                <table className='w-full border-collapse text-sm'>
                  <thead>
                    <tr>
                      {table.columns.map(col => (
                        <th key={col} className='border border-line bg-cream px-3 py-2 text-left font-medium text-ink'>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className='border border-line px-3 py-2 text-ink-soft'>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            <div className='mt-6 rounded-xl bg-cream p-4'>
              <p className='mb-2 text-sm font-medium text-ink'>How to measure</p>
              <ul className='flex flex-col gap-1.5 text-xs leading-relaxed text-ink-soft'>
                {measurementTips.map((tip, i) => <li key={i}>• {tip}</li>)}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SizeGuideModal
