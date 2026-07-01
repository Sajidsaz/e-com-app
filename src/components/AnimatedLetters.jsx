import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const containerVariants = (staggerSec, delaySec) => ({
    hidden: {},
    visible: {
        transition: {
            staggerChildren: staggerSec,
            delayChildren: delaySec,
        },
    },
})

const letterVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
    },
}

const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

/**
 * Splits `text` into per-letter animated spans while keeping it readable to
 * assistive tech as a single string (aria-label on the wrapper, individual
 * letters hidden from the accessibility tree).
 */
const AnimatedLetters = ({
    text,
    ariaLabel,
    start = true,
    staggerMs = 20,
    delayMs = 0,
    as: Wrapper = 'span',
    className = '',
    letterClassName = '',
}) => {
    const reduceMotion = useReducedMotion()

    if (reduceMotion) {
        return (
            <Wrapper aria-label={ariaLabel ?? text} className={className}>
                <motion.span
                    initial="hidden"
                    animate={start ? 'visible' : 'hidden'}
                    variants={fadeVariants}
                >
                    {text}
                </motion.span>
            </Wrapper>
        )
    }

    return (
        <Wrapper aria-label={ariaLabel ?? text} className={className}>
            <motion.span
                initial="hidden"
                animate={start ? 'visible' : 'hidden'}
                variants={containerVariants(staggerMs / 1000, delayMs / 1000)}
                style={{ display: 'inline' }}
            >
                {text.split(/(\s+)/).map((chunk, chunkIndex) =>
                    /^\s+$/.test(chunk) ? (
                        // Real whitespace text node between words = a guaranteed
                        // line-break opportunity so the phrase wraps on narrow
                        // screens (inline-block letters alone never break).
                        <React.Fragment key={`space-${chunkIndex}`}>{' '}</React.Fragment>
                    ) : (
                        // Each word is an inline-block unit (never breaks mid-word),
                        // with its letters animating individually inside it.
                        <span
                            key={`word-${chunkIndex}`}
                            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                        >
                            {chunk.split('').map((char, i) => (
                                <motion.span
                                    key={`${char}-${i}`}
                                    aria-hidden="true"
                                    variants={letterVariants}
                                    className={letterClassName}
                                    style={{ display: 'inline-block' }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    )
                )}
            </motion.span>
        </Wrapper>
    )
}

export default AnimatedLetters
