import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Functional pages keep the default cursor — no fancy cursor near checkout,
// payment, or auth forms.
const DISABLED_ROUTES = ['/cart', '/place-order', '/login', '/forgot-password', '/reset-password', '/verify-email']

const LABELS = { view: 'View', zoom: 'Zoom', drag: 'Drag' }

/**
 * HEYSAZ custom cursor: small ink dot + soft ring that follows with a spring
 * lag. The ring expands over links/buttons; elements tagged
 * `data-cursor="view|zoom|drag"` swap it for a labelled bubble. Renders only
 * for fine pointers (no touch devices) and steps aside over form fields.
 */
const CustomCursor = () => {
  const location = useLocation()

  // Fine pointer + motion allowed, decided once — this is a desktop-only detail
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const routeDisabled = DISABLED_ROUTES.includes(location.pathname)
  const active = enabled && !routeDisabled

  // 'default' | 'link' | 'label' | 'native' (over form fields)
  const [mode, setMode] = useState('default')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // Ring trails slightly behind the pointer — the "smooth follow delay"
  const ringX = useSpring(x, { stiffness: 260, damping: 24 })
  const ringY = useSpring(y, { stiffness: 260, damping: 24 })

  useEffect(() => {
    if (!active) return

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }

    const onOver = (e) => {
      const target = e.target
      if (!(target instanceof Element)) return
      if (target.closest('input, textarea, select')) {
        setMode('native')
        return
      }
      const labelled = target.closest('[data-cursor]')
      if (labelled && LABELS[labelled.dataset.cursor]) {
        setLabel(LABELS[labelled.dataset.cursor])
        setMode('label')
        return
      }
      if (target.closest('a, button, [role="button"], summary')) {
        setMode('link')
        return
      }
      setMode('default')
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [active])

  // Hide the native cursor while the custom one is on duty (form fields and
  // disabled routes get the native cursor back).
  useEffect(() => {
    const hideNative = active && visible && mode !== 'native'
    document.documentElement.classList.toggle('cursor-hidden', hideNative)
    return () => document.documentElement.classList.remove('cursor-hidden')
  }, [active, visible, mode])

  // Reset hover state when the route changes under the cursor
  useEffect(() => {
    setMode('default')
  }, [location.pathname])

  if (!active) return null

  const shown = visible && mode !== 'native'
  const isLabel = mode === 'label'

  return (
    /* Trailing ring / label bubble */
    <motion.div
      style={{ x: ringX, y: ringY }}
      className='pointer-events-none fixed left-0 top-0 z-[9999]'
      aria-hidden='true'
    >
      <div
        className={`absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[transform,opacity,border-color] duration-300 ease-out ${
          shown && !isLabel ? 'opacity-100' : 'opacity-0'
        } ${mode === 'link' ? 'scale-150 border-ink/70' : 'scale-100 border-ink/40'}`}
      />
      <div
        className={`absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-[11px] font-medium tracking-wide text-white transition-[transform,opacity] duration-300 ease-out ${
          shown && isLabel ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        {label}
      </div>
    </motion.div>
  )
}

export default CustomCursor
