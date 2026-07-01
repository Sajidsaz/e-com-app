import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import AnimatedLetters from './AnimatedLetters'
import HeroGallery from './HeroGallery'
import { useAnimationGate } from '../context/AnimationGateContext'

// Offsets (ms) from the moment the hero is cleared to start animating —
// i.e. from `ready`, whether that's right after the splash or immediately
// on a repeat visit within the same session.
const TIMELINE = {
    headline: 300,
    paragraph: 950,
    button: 1150,
    gallery: 1450,
}

const Hero = () => {
    const { ready } = useAnimationGate()
    const reduceMotion = useReducedMotion()
    const navigate = useNavigate()
    const [stage, setStage] = useState({
        headline: false,
        paragraph: false,
        button: false,
        gallery: false,
    })

    useEffect(() => {
        if (!ready) return

        if (reduceMotion) {
            setStage({ headline: true, paragraph: true, button: true, gallery: true })
            return
        }

        const timers = Object.entries(TIMELINE).map(([key, delay]) =>
            setTimeout(() => setStage((prev) => ({ ...prev, [key]: true })), delay)
        )
        return () => timers.forEach(clearTimeout)
    }, [ready, reduceMotion])

    return (
        <div className="hero-gradient-bg flex flex-col items-center px-4 py-5 sm:py-8 text-center">
            <h1 className="prata-regular w-full max-w-4xl text-2xl leading-tight text-[#1a1a1a] sm:text-4xl lg:text-5xl">
                <AnimatedLetters
                    as="span"
                    text="Elevate Your Everyday Style"
                    ariaLabel="Elevate Your Everyday Style"
                    start={stage.headline}
                    staggerMs={20}
                    className="inline"
                />
            </h1>

            <motion.p
                className="mt-4 w-full max-w-xl text-sm text-gray-500 sm:text-base"
                initial={{ opacity: 0 }}
                animate={stage.paragraph ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                Discover premium menswear designed for confidence, comfort, and modern living. From sharp formal wear to versatile casual essentials, our collections help you look your best for every occasion.
            </motion.p>

            <motion.div
                className="relative z-10 mt-4 mb-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={stage.button ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <div className={stage.button && !reduceMotion ? 'cta-pulse' : ''}>
                    <button
                        onClick={() => navigate('/collection')}
                        className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black hover:ring-1 hover:ring-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                        Shop Now
                        <span aria-hidden="true">→</span>
                    </button>
                    <br /><br/>
                </div>
            </motion.div>

            <HeroGallery start={stage.gallery} />
        </div>
    )
}

export default Hero
