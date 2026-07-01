import React, { useRef, useEffect } from 'react'
import { useScroll, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { heroGalleryData } from '../data/heroGalleryData'
import HeroGalleryCard from './HeroGalleryCard'

const MAX_PARALLAX_PX = 8

/**
 * Owns the single shared scroll-progress tracker and shared pointer-driven
 * spring values so every card moves together as one gallery, rather than
 * each card wiring up its own scroll/mouse listeners.
 */
const HeroGallery = ({ start }) => {
    const containerRef = useRef(null)
    const reduceMotion = useReducedMotion()

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    })

    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const springX = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.5 })
    const springY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.5 })

    useEffect(() => {
        if (reduceMotion) return
        const node = containerRef.current
        if (!node) return

        const handlePointerMove = (event) => {
            const rect = node.getBoundingClientRect()
            const relX = (event.clientX - rect.left) / rect.width - 0.5
            const relY = (event.clientY - rect.top) / rect.height - 0.5
            rawX.set(relX * 2 * MAX_PARALLAX_PX)
            rawY.set(relY * 2 * MAX_PARALLAX_PX)
        }

        const handlePointerLeave = () => {
            rawX.set(0)
            rawY.set(0)
        }

        node.addEventListener('pointermove', handlePointerMove)
        node.addEventListener('pointerleave', handlePointerLeave)
        return () => {
            node.removeEventListener('pointermove', handlePointerMove)
            node.removeEventListener('pointerleave', handlePointerLeave)
        }
    }, [reduceMotion, rawX, rawY])

    return (
        <div
            ref={containerRef}
            className="hero-gallery -mt-2 flex w-full items-end justify-center gap-2 py-2 sm:gap-4 lg:gap-6"
        >
            {heroGalleryData.map((card, index) => (
                <HeroGalleryCard
                    key={card.id}
                    card={card}
                    index={index}
                    start={start}
                    scrollYProgress={scrollYProgress}
                    mouseX={springX}
                    mouseY={springY}
                />
            ))}
        </div>
    )
}

export default HeroGallery
