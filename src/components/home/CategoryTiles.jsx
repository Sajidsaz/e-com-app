import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import ArchImage from '../ui/ArchImage'
import { ArrowIcon } from '../ui/Button'
import { homeContent } from '../../data/homeContent'

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const CategoryTiles = () => (
  <section className='py-12'>
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <SectionHeading
          title='Shop by Category'
          subtitle='Find the perfect piece for every occasion.'
        />
      </motion.div>

      <motion.div
        variants={grid}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-60px' }}
        className='mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4'
      >
        {homeContent.categories.map(({ label, image, type }) => (
          <motion.div key={label} variants={card}>
            <Link
              to={`/collection?type=${encodeURIComponent(type)}`}
              className='group flex flex-col items-center gap-4 rounded-2xl border border-line bg-white p-4 pb-5 transition-all duration-300 hover:border-ink hover:shadow-md'
            >
              <ArchImage
                src={image}
                alt={label}
                className='aspect-[3/4] w-full'
                imgClassName='transition-transform duration-300 group-hover:scale-[1.04]'
              />
              <div className='flex flex-col items-center gap-1'>
                <p className='text-sm font-medium text-ink'>{label}</p>
                <span className='flex items-center gap-1.5 text-xs text-ink-soft underline underline-offset-4 transition-colors group-hover:text-ink'>
                  Shop Now
                  <ArrowIcon className='w-3 h-3 transition-transform duration-300 group-hover:translate-x-1' />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  </section>
)

export default CategoryTiles
