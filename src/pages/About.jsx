import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import ArchImage from '../components/ui/ArchImage'
import Reveal from '../components/ui/Reveal'
import Testimonials from '../components/Testimonials'
import { CheckIcon } from '../components/ui/Icons'
import { aboutContent } from '../data/aboutContent'

const { hero, story, values, qualityPromise, stats, founderQuote } = aboutContent

const About = () => {
  return (
    <div>

      {/* Hero */}
      <section className='w-full bg-cream'>
        <Container className='grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-2 lg:py-16'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className='flex flex-col items-start gap-5'
          >
            <p className='text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft'>{hero.eyebrow}</p>
            <h1 className='font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl'>{hero.title}</h1>
            <p className='max-w-md text-base text-ink-soft'>{hero.subcopy}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className='grid grid-cols-3 items-end gap-4'
          >
            {hero.images.map(({ src, alt, arch }, i) => (
              <ArchImage key={i} src={src} alt={alt} arch={arch} className={`w-full ${i === 0 ? 'aspect-[3/4]' : 'aspect-[3/5]'}`} />
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Our Story */}
      <Reveal>
        <Container className='grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-2'>
          <div className='overflow-hidden rounded-2xl'>
            <img src={story.image.src} alt={story.image.alt} loading='lazy' className='aspect-[4/3] w-full object-cover' />
          </div>
          <div className='flex flex-col items-start gap-4'>
            <p className='text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft'>{story.eyebrow}</p>
            <h2 className='font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>{story.title}</h2>
            {story.paragraphs.map((text, i) => (
              <p key={i} className='max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base'>{text}</p>
            ))}
          </div>
        </Container>
      </Reveal>

      {/* Value cards */}
      <Reveal>
        <Container className='py-6'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {values.map(({ title, text }) => (
              <div key={title} className='flex flex-col items-center gap-2 rounded-2xl border border-line bg-white px-6 py-8 text-center'>
                <span className='flex h-10 w-10 items-center justify-center rounded-full border border-line'>
                  <CheckIcon className='w-4 h-4 text-ink' />
                </span>
                <p className='text-sm font-medium text-ink'>{title}</p>
                <p className='text-xs leading-relaxed text-ink-soft'>{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Reveal>

      {/* Quality promise */}
      <Reveal>
        <Container className='py-10'>
          <div className='grid grid-cols-1 gap-8 rounded-2xl bg-cream-dark p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr_1fr]'>
            <div className='flex flex-col justify-center gap-3'>
              <p className='text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft'>{qualityPromise.eyebrow}</p>
              <h2 className='font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>{qualityPromise.title}</h2>
              <p className='text-sm leading-relaxed text-ink-soft'>{qualityPromise.subcopy}</p>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {qualityPromise.images.map((src, i) => (
                <div key={i} className='overflow-hidden rounded-2xl'>
                  <img src={src} alt='Craftsmanship detail' loading='lazy' className='aspect-[3/4] h-full w-full object-cover' />
                </div>
              ))}
            </div>
            <div className='flex flex-col justify-center gap-4'>
              {qualityPromise.points.map(({ title, text }) => (
                <div key={title} className='flex items-start gap-3 rounded-xl border border-line bg-white p-3.5'>
                  <CheckIcon className='mt-0.5 w-4 h-4 shrink-0 text-ink' />
                  <div>
                    <p className='text-sm font-medium text-ink'>{title}</p>
                    <p className='text-xs text-ink-soft'>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Reveal>

      {/* Stats */}
      <Reveal>
        <Container className='py-8'>
          <div className='grid grid-cols-2 divide-line rounded-2xl border border-line bg-white py-8 sm:grid-cols-4 sm:divide-x'>
            {stats.map(({ value, label }) => (
              <div key={label} className='flex flex-col items-center gap-1 py-3'>
                <p className='font-display text-3xl font-semibold text-ink'>{value}</p>
                <p className='text-xs text-ink-soft'>{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Reveal>

      {/* Founder quote */}
      <Reveal>
        <Container className='py-10'>
          <div className='grid grid-cols-1 items-center gap-8 rounded-2xl bg-cream-dark p-6 sm:p-10 lg:grid-cols-[1fr_2fr]'>
            <ArchImage src={founderQuote.image.src} alt={founderQuote.image.alt} className='mx-auto aspect-[3/4] w-full max-w-xs' />
            <div className='flex flex-col gap-4'>
              <span className='font-serif-display text-5xl leading-none text-ink'>“</span>
              <p className='max-w-2xl text-base leading-relaxed text-ink sm:text-lg'>{founderQuote.quote}</p>
              <p className='font-serif-display text-sm italic text-ink-soft'>{founderQuote.attribution}</p>
            </div>
          </div>
        </Container>
      </Reveal>

      <Reveal>
        <Testimonials title='What Our Customers Say' subtitle='Honest words from the people who wear HeySaz.' />
      </Reveal>

      {/* CTA banner */}
      <Reveal>
        <Container className='py-10'>
          <div className='flex flex-col items-center gap-4 rounded-2xl border border-line bg-white px-6 py-12 text-center'>
            <h2 className='font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>Explore the Collection</h2>
            <p className='max-w-md text-sm text-ink-soft'>Discover timeless pieces made for confidence and everyday elegance.</p>
            <div className='flex flex-wrap justify-center gap-3'>
              <Button as={Link} to='/collection' arrow>Shop the Collection</Button>
              <Button as={Link} to='/contact' variant='outline'>Contact Us</Button>
            </div>
          </div>
        </Container>
      </Reveal>

    </div>
  )
}

export default About
