import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from './ui/Container'
import { ShieldIcon } from './ui/Icons'

const columns = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const column = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const shopLinks = [
  { label: 'New Arrivals', to: '/collection?type=New In' },
  { label: 'Collection', to: '/collection' },
  { label: 'Casual Shirts', to: '/collection?type=Casual Shirts' },
  { label: 'Trousers', to: '/collection?type=Trousers' },
  { label: 'Outerwear', to: '/collection?type=Outerwear' },
  { label: 'Accessories', to: '/collection?type=Accessories' },
]

const supportLinks = [
  { label: 'Shipping & Delivery', to: '/contact' },
  { label: 'Returns & Exchanges', to: '/contact' },
  { label: 'FAQ', to: '/contact' },
  { label: 'Track Your Order', to: '/contact' },
]

const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Our Story', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

const PaymentChip = ({ children }) => (
  <span className='rounded border border-white/20 bg-white/10 px-2 py-1 text-[9px] font-semibold tracking-wider text-white/80'>
    {children}
  </span>
)

const FooterColumn = ({ title, links }) => (
  <motion.div variants={column}>
    <p className='mb-4 text-sm font-medium text-white'>{title}</p>
    <ul className='flex flex-col gap-2.5'>
      {links.map(({ label, to }) => (
        <li key={label}>
          <Link to={to} className='text-[13px] text-white/60 transition-colors hover:text-white'>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </motion.div>
)

const Footer = () => {
  return (
    <footer className='mt-24 w-full bg-ink text-white'>
      <Container className='py-14'>
        <motion.div
          variants={columns}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, margin: '-40px' }}
          className='grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.2fr]'
        >

          <motion.div variants={column}>
            <div className='inline-flex flex-col items-center border border-white/40 px-3 py-1 leading-none'>
              <span className='text-lg font-bold tracking-wide text-white'>HEYSAZ</span>
              <span className='text-[9px] font-medium tracking-[0.3em] text-white/60'>FASHION</span>
            </div>
            <p className='mt-5 max-w-xs text-[13px] leading-relaxed text-white/60'>
              Modern menswear crafted with premium materials, timeless design, and attention to detail.
            </p>
          </motion.div>

          <FooterColumn title='Shop' links={shopLinks} />
          <FooterColumn title='Support' links={supportLinks} />
          <FooterColumn title='Company' links={companyLinks} />

          <motion.div variants={column}>
            <p className='mb-4 text-sm font-medium text-white'>Contact</p>
            <ul className='flex flex-col gap-2.5 text-[13px] text-white/60'>
              <li>
                <a href='mailto:heysaz00@gmail.com' className='transition-colors hover:text-white'>heysaz00@gmail.com</a>
              </li>
              <li>
                <a href='tel:+94704490444' className='transition-colors hover:text-white'>+94 70 449 0444</a>
              </li>
            </ul>
          </motion.div>

        </motion.div>
      </Container>

      <div className='border-t border-white/10'>
        <Container className='flex flex-col items-center justify-between gap-4 py-5 sm:flex-row'>
          <div className='flex items-center gap-2'>
            <PaymentChip>VISA</PaymentChip>
            <PaymentChip>MASTERCARD</PaymentChip>
            <PaymentChip>COD</PaymentChip>
          </div>
          <p className='text-[12px] text-white/50'>&copy; 2025 HeySaz Fashion. All rights reserved.</p>
          <span className='flex items-center gap-1.5 text-[11px] text-white/50'>
            <ShieldIcon className='w-3.5 h-3.5' />
            SSL Secure
          </span>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
