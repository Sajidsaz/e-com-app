import React, { useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ShopContext } from '../../context/ShopContext'
import Container from '../ui/Container'
import Button from '../ui/Button'
import StarRating from '../ui/StarRating'
import { getEffectivePrice } from '../../utils/format'

const infoGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const infoItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const chipGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const chip = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
}
const detailCard = (delay) => ({
  initial: { opacity: 0, x: 32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
})

// Spotlights the first bestseller (falls back to the first product).
const FeaturedLook = () => {
  const { products, formatPrice } = useContext(ShopContext)
  const panelRef = useRef(null)

  // Gentle scroll parallax: the model image drifts upward as the section
  // moves through the viewport (small range — safe on mobile too).
  const { scrollYProgress } = useScroll({ target: panelRef, offset: ['start end', 'end start'] })
  const modelY = useTransform(scrollYProgress, [0, 1], [24, -24])

  const product = products.find(p => p.bestseller) || products[0]
  if (!product) return null

  const sizes = [...new Set((product.variants || []).map(v => v.size))]
  const rating = product.rating || { average: 0, count: 0 }

  return (
    <section className='py-12'>
      <Container>
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='grid grid-cols-1 gap-8 rounded-2xl bg-cream-dark p-6 sm:p-10 lg:grid-cols-[1.1fr_1.2fr_1fr]'
        >

          <div className='overflow-hidden rounded-2xl'>
            <motion.img
              style={{ y: modelY }}
              src={product.image?.[0]}
              alt={product.name}
              loading='lazy'
              className='aspect-[3/4] h-full w-full scale-110 object-cover'
            />
          </div>

          <motion.div
            variants={infoGroup}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, margin: '-80px' }}
            className='flex flex-col justify-center gap-4'
          >
            <motion.p variants={infoItem} className='text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft'>Featured Look</motion.p>
            <motion.h2 variants={infoItem} className='font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>The Modern Essential</motion.h2>
            <motion.p variants={infoItem} className='max-w-md text-sm leading-relaxed text-ink-soft'>
              A refined blend of structure and comfort, made for elevated everyday style.
            </motion.p>
            {rating.count > 0 && (
              <motion.div variants={infoItem}>
                <StarRating rating={rating.average} count={rating.count} showValue />
              </motion.div>
            )}
            <motion.p variants={infoItem} className='text-xl font-semibold text-ink'>
              {(() => {
                const pr = getEffectivePrice(product)
                return pr.onSale ? (
                  <span className='flex items-center gap-2'>
                    <span className='text-[#b3402f]'>{formatPrice(pr.price)}</span>
                    <span className='text-sm text-ink-soft line-through'>{formatPrice(pr.original)}</span>
                  </span>
                ) : formatPrice(pr.price)
              })()}
            </motion.p>
            {sizes.length > 0 && (
              <motion.div variants={infoItem}>
                <p className='mb-2 text-xs font-medium text-ink-soft'>Size:</p>
                <motion.div variants={chipGroup} className='flex flex-wrap gap-2'>
                  {sizes.map(size => (
                    <motion.span key={size} variants={chip} className='rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink'>
                      {size}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            )}
            <motion.div variants={infoItem}>
              <Button as={Link} to={`/product/${product._id}`} className='mt-2 self-start' arrow>Shop The Look</Button>
            </motion.div>
          </motion.div>

          <div className='hidden grid-rows-2 gap-4 lg:grid'>
            {(product.image || []).slice(1, 3).map((src, i) => (
              <motion.div key={i} {...detailCard(0.15 + i * 0.15)} className='overflow-hidden rounded-2xl'>
                <img src={src} alt={`${product.name} detail ${i + 1}`} loading='lazy' className='h-full w-full object-cover' />
              </motion.div>
            ))}
          </div>

        </motion.div>
      </Container>
    </section>
  )
}

export default FeaturedLook
