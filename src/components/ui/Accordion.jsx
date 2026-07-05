import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Single-open accordion. `items` = [{ title, content }] where content is a
 * string or JSX. `defaultOpen` = index opened initially (null = all closed).
 */
const Accordion = ({ items = [], defaultOpen = 0, className = '' }) => {
  const [openIndex, setOpenIndex] = useState(defaultOpen)

  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <div key={i}>
            <button
              type='button'
              onClick={() => setOpenIndex(open ? null : i)}
              className='flex w-full items-center justify-between gap-4 py-4 text-left cursor-pointer'
              aria-expanded={open}
            >
              <span className='text-sm font-medium text-ink'>{item.title}</span>
              <span className='text-lg leading-none text-ink-soft select-none'>{open ? '−' : '+'}</span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className='overflow-hidden'
                >
                  <div className='pb-5 text-sm leading-relaxed text-ink-soft'>{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
