import React from 'react'
import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Button from '../ui/Button'
import ArchImage from '../ui/ArchImage'
import { assets } from '../../assets/assets'

const PromoBanner = () => (
  <Container className='py-10'>
    <div className='grid grid-cols-1 items-center gap-8 rounded-2xl bg-cream-dark px-6 py-10 sm:px-10 lg:grid-cols-[1.2fr_1fr_0.8fr]'>
      <div className='flex flex-col items-start gap-4'>
        <h2 className='font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>Modern Essentials</h2>
        <p className='max-w-sm text-sm leading-relaxed text-ink-soft'>
          Timeless designs. Premium fabrics. Made for the way you live today.
        </p>
        <Button as={Link} to='/collection' arrow>Shop The Edit</Button>
      </div>
      <ArchImage src={assets.model2} alt='Modern essentials look' className='hidden aspect-[4/5] w-full sm:block' />
      <div className='hidden overflow-hidden rounded-2xl lg:block'>
        <img src={assets.hero_img1} alt='Fabric detail' loading='lazy' className='aspect-square w-full object-cover' />
      </div>
    </div>
  </Container>
)

export default PromoBanner
