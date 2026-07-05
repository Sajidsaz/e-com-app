import React from 'react'
import { motion } from 'framer-motion'

/**
 * The single scroll-reveal primitive for the redesign: subtle fade + rise
 * when the element enters the viewport, once.
 */
const Reveal = ({ children, delay = 0, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

export default Reveal
