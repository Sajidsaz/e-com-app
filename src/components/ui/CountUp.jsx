import React, { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts a stat like "10K+", "4.8/5", or "99%" up from zero the first time
 * it enters the viewport. Non-numeric prefix/suffix are preserved.
 */
const CountUp = ({ value, duration = 1.4, className = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()

  const match = String(value).match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/)
  const prefix = match?.[1] ?? ''
  const target = match ? parseFloat(match[2]) : null
  const suffix = match?.[3] ?? ''
  const decimals = match?.[2]?.includes('.') ? match[2].split('.')[1].length : 0

  const [display, setDisplay] = useState(target === null || reduceMotion ? String(value) : prefix + (0).toFixed(decimals) + suffix)

  useEffect(() => {
    if (!inView || target === null || reduceMotion) return
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(prefix + latest.toFixed(decimals) + suffix),
    })
    return () => controls.stop()
  }, [inView, target, reduceMotion])

  return <span ref={ref} className={className}>{display}</span>
}

export default CountUp
