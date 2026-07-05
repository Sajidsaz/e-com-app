import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShopContext } from '../../context/ShopContext'
import Container from '../ui/Container'
import ProductCard from '../ProductCard'
import { ArrowIcon } from '../ui/Button'

const NewArrivals = () => {
  const { products } = useContext(ShopContext)

  const latest = [...products].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 8)

  return (
    <section className='py-12'>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='flex items-end justify-between'
        >
          <div>
            <h2 className='font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>New Arrivals</h2>
            <p className='mt-1 text-sm text-ink-soft'>Discover the latest additions to your wardrobe.</p>
          </div>
          <Link to='/collection' className='group flex items-center gap-1.5 text-sm font-medium text-ink underline underline-offset-4 hover:opacity-70'>
            View All <ArrowIcon className='w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1' />
          </Link>
        </motion.div>
        <div className='mt-8 grid grid-cols-2 gap-4 gap-y-8 sm:gap-6 lg:grid-cols-4'>
          {latest.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default NewArrivals
