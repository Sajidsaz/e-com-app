import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Container from '../ui/Container'
import Button from '../ui/Button'
import ArchImage from '../ui/ArchImage'
import { homeContent } from '../../data/homeContent'

const { hero } = homeContent

// Sequence: headline (masked, word by word) → paragraph → images → CTA.
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1]
const T = {
  headline: 0.25,   // + 0.07s per word
  paragraph: 0.6,
  imageCenter: 0.7,
  imageTop: 0.85,
  imageBottom: 0.95,
  cta: 1.05,
  avatars: 1.2,
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

// Each word is masked and rises into view — reads as a line-by-line reveal
// at any wrap width.
const MaskedHeadline = ({ text }) => (
  <h1 className='font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl'>
    {text.split(' ').map((word, i) => (
      <span key={i} className='inline-block overflow-hidden pb-1 align-top'>
        <motion.span
          className='inline-block'
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: T.headline + i * 0.07 }}
        >
          {word}{' '}
        </motion.span>
      </span>
    ))}
  </h1>
)

const HomeHero = () => {
  // Mouse parallax: normalized cursor position (-0.5..0.5) smoothed with
  // springs; each image drifts a few px at a different rate for depth.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 16 })
  const sy = useSpring(my, { stiffness: 60, damping: 16 })

  const centerX = useTransform(sx, [-0.5, 0.5], [-7, 7])
  const centerY = useTransform(sy, [-0.5, 0.5], [-5, 5])
  const topX = useTransform(sx, [-0.5, 0.5], [10, -10])
  const topY = useTransform(sy, [-0.5, 0.5], [7, -7])
  const bottomX = useTransform(sx, [-0.5, 0.5], [-12, 12])
  const bottomY = useTransform(sy, [-0.5, 0.5], [8, -8])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <section className='w-full bg-cream'>
      <Container className='grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-2 lg:py-20'>

        <div className='flex flex-col items-start gap-6'>
          <MaskedHeadline text={hero.headline} />

          <motion.p {...fadeUp(T.paragraph)} className='max-w-md text-base text-ink-soft'>
            {hero.subcopy}
          </motion.p>

          <motion.div {...fadeUp(T.cta)} className='flex flex-wrap items-center gap-4'>
            <Button as={Link} to='/collection' size='lg' arrow>{hero.cta}</Button>
            <Link to='/collection' className='text-sm font-medium text-ink underline underline-offset-4 hover:opacity-70'>
              {hero.secondaryCta}
            </Link>
          </motion.div>

          <motion.div {...fadeUp(T.avatars)} className='mt-2 flex items-center gap-3'>
            <div className='flex -space-x-3'>
              {hero.avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=''
                  className='h-9 w-9 rounded-full border-2 border-cream object-cover'
                />
              ))}
            </div>
            <p className='text-sm text-ink-soft'>
              <span className='font-semibold text-ink'>{hero.customers}</span> {hero.customersLabel}
            </p>
          </motion.div>
        </div>

        <div
          className='grid grid-cols-[2fr_1fr] gap-4'
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Center arch: slow settle from 1.05 to 1 (+ parallax drift) */}
          <motion.div
            style={{ x: centerX, y: centerY }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: T.imageCenter }}
          >
            <ArchImage
              src={hero.images.center.src}
              alt={hero.images.center.alt}
              className='aspect-[3/4] w-full'
            />
          </motion.div>

          <div className='flex flex-col gap-4'>
            {/* Side images slide in gently; inner div carries the parallax */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: T.imageTop }}
            >
              <motion.div style={{ x: topX, y: topY }}>
                <ArchImage
                  src={hero.images.topRight.src}
                  alt={hero.images.topRight.alt}
                  className='aspect-square w-full'
                />
              </motion.div>
            </motion.div>

            <motion.div
              className='min-h-0 flex-1'
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: T.imageBottom }}
            >
              <motion.div style={{ x: bottomX, y: bottomY }} className='h-full'>
                <ArchImage
                  src={hero.images.bottomRight.src}
                  alt={hero.images.bottomRight.alt}
                  arch={false}
                  className='h-full w-full'
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

      </Container>
    </section>
  )
}

export default HomeHero
