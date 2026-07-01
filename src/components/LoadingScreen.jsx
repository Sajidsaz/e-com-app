import React, { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import AnimatedLetters from './AnimatedLetters'
import { useAnimationGate } from '../context/AnimationGateContext'

const MIN_DISPLAY_MS = 900
const SAFETY_NET_MS = 4000

/**
 * Splash screen shown once per session. Gated on real page readiness
 * (window load + web fonts) rather than a pure fixed timer, with a floor so
 * it never feels like a flicker and a safety net so a stuck `fonts.ready`
 * can never lock the app behind the splash forever.
 */
const LoadingScreen = ({ onDone }) => {
    const { markSplashShown } = useAnimationGate()
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        let cancelled = false

        const windowLoad =
            document.readyState === 'complete'
                ? Promise.resolve()
                : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))

        const fontsReady = document.fonts?.ready ?? Promise.resolve()
        const floor = new Promise((resolve) => setTimeout(resolve, MIN_DISPLAY_MS))
        const readyAndFloor = Promise.all([windowLoad, fontsReady, floor])
        const safetyNet = new Promise((resolve) => setTimeout(resolve, SAFETY_NET_MS))

        Promise.race([readyAndFloor, safetyNet]).then(() => {
            if (cancelled) return
            markSplashShown()
            onDone?.()
        })

        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.4, ease: 'easeInOut' }}
        >
            <AnimatedLetters
                text="HEYSAZ"
                as="div"
                staggerMs={80}
                className="text-4xl sm:text-5xl font-semibold tracking-[0.2em] text-[#1a1a1a]"
            />
        </motion.div>
    )
}

export default LoadingScreen
