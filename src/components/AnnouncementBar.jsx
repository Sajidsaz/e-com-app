import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TruckIcon, ReturnIcon, ShieldIcon } from './ui/Icons'

const messages = [
  { icon: TruckIcon, text: 'Free delivery over Rs. 15,000' },
  { icon: ReturnIcon, text: '7-day easy returns' },
  { icon: ShieldIcon, text: 'Secure checkout' },
]

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000)
    return () => clearInterval(id)
  }, [])

  const Current = messages[index]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className='w-full bg-ink text-white'
    >
      {/* Desktop: all three messages */}
      <div className='mx-auto hidden max-w-[1400px] items-center justify-center gap-10 px-8 py-2 sm:flex'>
        {messages.map(({ icon: Icon, text }, i) => (
          <span key={i} className='flex items-center gap-2 text-[11px] tracking-wide text-white/90'>
            <Icon className='w-3.5 h-3.5' />
            {text}
          </span>
        ))}
      </div>
      {/* Mobile: single cycling message */}
      <div className='flex h-8 items-center justify-center overflow-hidden sm:hidden'>
        <AnimatePresence mode='wait'>
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className='flex items-center gap-2 text-[11px] tracking-wide text-white/90'
          >
            <Current.icon className='w-3.5 h-3.5' />
            {Current.text}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default AnnouncementBar
