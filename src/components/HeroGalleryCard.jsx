import React from 'react'
import { motion, useTransform, useReducedMotion } from 'framer-motion'

/**
 * A single gallery card, built as nested layers so each animated transform
 * source lives on its own DOM node and none of them clobber one another:
 * mount reveal -> scroll parallax -> mouse parallax -> size (hover-depth,
 * CSS-driven) -> float (CSS keyframe) -> arch mask (crop + sweep + hover
 * scale, all confined to the <img> itself).
 */
const HeroGalleryCard = ({ card, index, start, scrollYProgress, mouseX, mouseY }) => {
    const reduceMotion = useReducedMotion()

    const scrollRange = reduceMotion ? [0, 0] : [0, -60 * card.scrollParallaxRate]
    const y = useTransform(scrollYProgress, [0, 1], scrollRange)

    return (
        <motion.div
            className={`hero-gallery-item flex-col items-center ${
                card.hideOnMobile ? 'hidden sm:flex' : 'flex'
            }`}
            initial={{ opacity: 0, y: 24 }}
            animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
                duration: 0.6,
                delay: reduceMotion ? 0 : index * 0.15,
                ease: 'easeOut',
            }}
        >
            <motion.div style={{ y }}>
                <motion.div style={{ x: mouseX, y: mouseY }}>
                    <div
                        className={`hero-card-size ${card.verticalOffsetClass}`}
                        style={{
                            '--card-scale': card.restScale,
                            '--hover-scale-focused': card.hoverScaleFocused,
                            '--hover-scale-unfocused': card.hoverScaleUnfocused,
                        }}
                    >
                        <div
                            className="hero-float"
                            style={{
                                '--float-dur': `${card.floatDurationSec}s`,
                                '--float-amp': `${card.floatAmplitudePx}px`,
                                '--float-delay': `${card.floatDelaySec}s`,
                            }}
                        >
                            <div
                                className={`relative aspect-[1/2] overflow-hidden rounded-t-full ${card.sizeClass}`}
                            >
                                <div
                                    className="hero-sweep-overlay"
                                    style={{ '--sweep-delay': `${card.sweepDelaySec}s` }}
                                    aria-hidden="true"
                                />
                                <img
                                    src={card.src}
                                    alt={card.alt}
                                    className="hero-card-img h-full w-full object-cover transition-[transform,filter] duration-[600ms] ease-out hover:scale-105 hover:brightness-105"
                                    style={{ objectPosition: card.objectPosition }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default HeroGalleryCard
