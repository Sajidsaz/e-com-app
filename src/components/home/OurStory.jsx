import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '../ui/Container'
import Button from '../ui/Button'
import { homeContent } from '../../data/homeContent'
import { CheckIcon } from '../ui/Icons'

const { story } = homeContent

// Image slides from the left; text column fades from the right with the
// value icons appearing one by one and the CTA last.
const textGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const fromRight = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const valueGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const valueItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const OurStory = () => (
  <section className='w-full bg-cream-dark py-14'>
    <Container className='grid grid-cols-1 items-center gap-10 lg:grid-cols-2'>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className='overflow-hidden rounded-2xl'
      >
        <img src={story.image.src} alt={story.image.alt} loading='lazy' className='aspect-[4/3] w-full object-cover' />
      </motion.div>

      <motion.div
        variants={textGroup}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-80px' }}
        className='flex flex-col items-start gap-5'
      >
        <motion.p variants={fromRight} className='text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft'>{story.eyebrow}</motion.p>
        <motion.h2 variants={fromRight} className='font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl lg:text-4xl'>{story.title}</motion.h2>
        {story.paragraphs.map((text, i) => (
          <motion.p key={i} variants={fromRight} className='max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base'>{text}</motion.p>
        ))}
        <motion.div variants={valueGroup} className='grid w-full grid-cols-2 gap-3 sm:grid-cols-4'>
          {story.values.map(({ label }) => (
            <motion.div key={label} variants={valueItem} className='flex items-center gap-2'>
              <CheckIcon className='w-4 h-4 shrink-0 text-ink' />
              <p className='text-xs font-medium text-ink'>{label}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div variants={fromRight}>
          <Button as={Link} to='/about' className='mt-2' arrow>{story.cta}</Button>
        </motion.div>
      </motion.div>
    </Container>
  </section>
)

export default OurStory
