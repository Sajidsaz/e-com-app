import React from 'react'
import { motion } from 'framer-motion'
import Container from './ui/Container'
import SectionHeading from './ui/SectionHeading'
import StarRating from './ui/StarRating'
import CountUp from './ui/CountUp'
import { ShieldIcon } from './ui/Icons'
import { testimonials } from '../data/testimonials'
import { homeContent } from '../data/homeContent'

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.08 } },
}

// Shared: Home ("Loved by Thousands") and About ("What Our Customers Say").
// Cards fade up in a stagger, stars pop one by one, stats count up once.
const Testimonials = ({ title = 'Loved by Thousands', subtitle = 'Real reviews from real customers.' }) => (
  <section className='py-12'>
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <SectionHeading title={title} subtitle={subtitle} />
      </motion.div>

      <motion.div
        variants={grid}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-60px' }}
        className='mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'
      >
        {testimonials.map(({ quote, name, tag }) => (
          <motion.div key={name} variants={cardVariant} className='flex flex-col gap-4 rounded-2xl border border-line bg-white p-6'>
            <StarRating rating={5} animated />
            <p className='flex-1 text-sm leading-relaxed text-ink-soft'>“{quote}”</p>
            <div>
              <p className='text-sm font-medium text-ink'>{name}</p>
              <p className='flex items-center gap-1 text-xs text-ink-soft'>
                <ShieldIcon className='w-3 h-3' /> {tag}
              </p>
            </div>
          </motion.div>
        ))}

        <motion.div variants={cardVariant} className='flex flex-col justify-center gap-6 rounded-2xl bg-cream-dark p-6'>
          {homeContent.stats.map(({ value, label }) => (
            <div key={label}>
              <CountUp value={value} className='font-display text-2xl font-semibold text-ink' />
              <p className='text-xs text-ink-soft'>{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </Container>
  </section>
)

export default Testimonials
