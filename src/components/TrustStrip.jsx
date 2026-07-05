import React from 'react'
import { motion } from 'framer-motion'
import Container from './ui/Container'
import { GlobeIcon, ReturnIcon, ShieldIcon, StarOutlineIcon } from './ui/Icons'

const items = [
  { icon: StarOutlineIcon, title: 'Premium Quality', text: 'Finest materials' },
  { icon: ShieldIcon, title: 'Secure Checkout', text: '100% protected' },
  { icon: ReturnIcon, title: 'Easy Returns', text: '7-day return policy' },
  { icon: GlobeIcon, title: 'Fast Delivery', text: 'Reliable & tracked' },
]

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const iconPop = {
  hidden: { opacity: 0, scale: 0.7 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

// Shared trust badges row (Home / Collection / Contact) — items fade up one
// by one with a soft icon scale.
const TrustStrip = () => (
  <Container className='py-8'>
    <motion.div
      variants={group}
      initial='hidden'
      whileInView='show'
      viewport={{ once: true, margin: '-60px' }}
      className='grid grid-cols-2 gap-6 rounded-2xl border border-line bg-white px-6 py-6 sm:grid-cols-4'
    >
      {items.map(({ icon: Icon, title, text }) => (
        <motion.div key={title} variants={item} className='flex items-center gap-3'>
          <motion.span variants={iconPop} className='flex shrink-0'>
            <Icon className='w-6 h-6 text-ink' />
          </motion.span>
          <div>
            <p className='text-sm font-medium text-ink'>{title}</p>
            <p className='text-xs text-ink-soft'>{text}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </Container>
)

export default TrustStrip
