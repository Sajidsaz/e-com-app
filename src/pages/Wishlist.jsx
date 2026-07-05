import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import ProductCard from '../components/ProductCard'
import { HeartIcon } from '../components/ui/Icons'

const Wishlist = () => {
  const { products, wishlist } = useContext(ShopContext)

  const items = wishlist
    .map(id => products.find(p => p._id === id))
    .filter(Boolean)

  return (
    <Container className='py-14'>
      <SectionHeading
        eyebrow='Saved Pieces'
        title='Your Wishlist'
        subtitle='Pieces you love, kept in one place.'
      />

      {items.length === 0 ? (
        <div className='mt-12 flex flex-col items-center gap-4 rounded-2xl border border-line bg-white px-6 py-16'>
          <HeartIcon className='w-8 h-8 text-ink-soft' />
          <p className='text-sm text-ink-soft'>Your wishlist is empty.</p>
          <Button as={Link} to='/collection' arrow>Shop the Collection</Button>
        </div>
      ) : (
        <div className='mt-12 grid grid-cols-2 gap-4 gap-y-8 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
          {items.map(product => (
            // The card's heart doubles as the remove control here
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </Container>
  )
}

export default Wishlist
