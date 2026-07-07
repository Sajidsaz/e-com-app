import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import QuantityStepper from '../components/ui/QuantityStepper'
import ProductCard from '../components/ProductCard'
import TrustStrip from '../components/TrustStrip'
import Reveal from '../components/ui/Reveal'
import { BagIcon, TrashIcon, TagIcon, ShieldIcon, ReturnIcon, TruckIcon } from '../components/ui/Icons'
import { getEffectivePrice } from '../utils/format'

const Cart = () => {

  const {
    products, formatPrice, cartItems, updateQuantity, navigate,
    getAvailableStock, parseKey, getCartAmount, getCartCount,
  } = useContext(ShopContext)

  const [cartData, setCartData] = useState([])
  const [promo, setPromo] = useState('')

  useEffect(() => {
    const tempData = []
    for (const productId in cartItems) {
      for (const key in cartItems[productId]) {
        if (cartItems[productId][key] > 0) {
          const { color, size } = parseKey(key)
          tempData.push({
            _id: productId,
            color,
            size,
            quantity: cartItems[productId][key],
          })
        }
      }
    }
    setCartData(tempData)
  }, [cartItems])

  // "You may also like": catalog items not already in the cart
  const suggestions = useMemo(() => {
    const inCart = new Set(cartData.map(item => item._id))
    return products.filter(p => !inCart.has(p._id)).slice(0, 4)
  }, [products, cartData])

  const count = getCartCount()
  const subtotal = getCartAmount()

  const applyPromo = (event) => {
    event.preventDefault()
    // No promo-code backend yet — honest placeholder per the agreed scope
    toast.info('Promo codes are coming soon!')
    setPromo('')
  }

  if (cartData.length === 0) {
    return (
      <Container className='py-20'>
        <div className='mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-line bg-white px-6 py-16 text-center'>
          <BagIcon className='w-8 h-8 text-ink-soft' />
          <h1 className='font-display text-2xl font-medium text-ink'>Your cart is empty</h1>
          <p className='text-sm text-ink-soft'>Looks like you haven’t added anything yet.</p>
          <Button as={Link} to='/collection' arrow>Shop the Collection</Button>
        </div>
      </Container>
    )
  }

  return (
    <div>
      <Container className='py-10'>
        <h1 className='font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl'>
          Your Cart <span className='text-ink-soft'>({count})</span>
        </h1>

        <div className='mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.8fr_1fr]'>

          {/* Items — removal slides the row out; `layout` closes the gap smoothly */}
          <div className='flex flex-col gap-4'>
            <AnimatePresence initial={false}>
            {cartData.map((item) => {
              const productData = products.find((product) => product._id === item._id)
              if (!productData) return null
              const available = getAvailableStock(item._id, item.color, item.size)

              return (
                <motion.div
                  key={`${item._id}-${item.color}-${item.size}`}
                  layout
                  exit={{ opacity: 0, x: -32, transition: { duration: 0.25, ease: 'easeIn' } }}
                  className='flex gap-4 rounded-2xl border border-line bg-white p-4'
                >
                  <Link to={`/product/${item._id}`} className='block h-28 w-22 shrink-0 overflow-hidden rounded-xl'>
                    <img className='h-full w-full object-cover' src={productData.image[0]} alt={productData.name} />
                  </Link>

                  <div className='flex min-w-0 flex-1 flex-col justify-between gap-2'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <Link to={`/product/${item._id}`} className='block truncate text-sm font-medium text-ink hover:underline'>
                          {productData.name}
                        </Link>
                        <p className='mt-1 text-xs text-ink-soft'>
                          Color: {item.color} &nbsp;·&nbsp; Size: {item.size}
                        </p>
                        <p className='mt-0.5 text-xs text-ink-soft'>
                          {available > 0 ? `${available} in stock` : 'Out of stock'}
                        </p>
                      </div>
                      <button
                        type='button'
                        aria-label='Remove from cart'
                        onClick={() => updateQuantity(item._id, item.color, item.size, 0)}
                        className='cursor-pointer text-ink-soft transition-colors hover:text-red-500'
                      >
                        <TrashIcon />
                      </button>
                    </div>

                    <div className='flex flex-wrap items-center justify-between gap-3'>
                      <QuantityStepper
                        value={item.quantity}
                        min={1}
                        max={Math.max(1, available)}
                        onChange={(qty) => updateQuantity(item._id, item.color, item.size, qty)}
                      />
                      {(() => {
                        const pr = getEffectivePrice(productData)
                        return pr.onSale ? (
                          <div className='text-right'>
                            <p className='text-sm font-semibold text-[#b3402f]'>{formatPrice(pr.price * item.quantity)}</p>
                            <p className='text-xs text-ink-soft line-through'>{formatPrice(pr.original * item.quantity)}</p>
                          </div>
                        ) : (
                          <p className='text-sm font-semibold text-ink'>{formatPrice(pr.price * item.quantity)}</p>
                        )
                      })()}
                    </div>
                  </div>
                </motion.div>
              )
            })}
            </AnimatePresence>

            {/* Promo code */}
            <form onSubmit={applyPromo} className='flex items-center gap-2 rounded-2xl border border-line bg-white p-3'>
              <TagIcon className='ml-2 w-4 h-4 shrink-0 text-ink-soft' />
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder='Enter promo code'
                className='min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm outline-none'
              />
              <Button type='submit' size='sm' disabled={!promo.trim()}>Apply</Button>
            </form>
          </div>

          {/* Order summary */}
          <div className='flex flex-col gap-4 lg:sticky lg:top-24'>
            <div className='rounded-2xl border border-line bg-white p-6'>
              <h2 className='text-base font-semibold text-ink'>Order Summary</h2>
              <div className='mt-4 flex flex-col gap-2.5 text-sm'>
                <div className='flex justify-between text-ink-soft'>
                  <span>Subtotal</span><span className='text-ink'>{formatPrice(subtotal)}</span>
                </div>
                <div className='flex justify-between text-ink-soft'>
                  <span>Shipping</span><span className='text-ink'>Free</span>
                </div>
                <div className='mt-2 flex justify-between border-t border-line pt-3 text-base font-semibold text-ink'>
                  <span>Total</span><span>{formatPrice(subtotal)}</span>
                </div>
              </div>
              <Button size='lg' arrow className='mt-5 w-full' onClick={() => navigate('/place-order')}>
                Proceed to Checkout
              </Button>
            </div>

            <div className='flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 text-sm'>
              {[
                { icon: ShieldIcon, title: 'Secure Checkout', text: 'Your payment is 100% secure' },
                { icon: ReturnIcon, title: 'Easy Returns', text: 'Return within 7 days of delivery' },
                { icon: TruckIcon, title: 'Fast Delivery', text: 'Delivered in 2–4 business days' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className='flex items-center gap-3'>
                  <Icon className='w-5 h-5 shrink-0 text-ink' />
                  <div>
                    <p className='text-sm font-medium text-ink'>{title}</p>
                    <p className='text-xs text-ink-soft'>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>

      <Reveal><TrustStrip /></Reveal>

      {suggestions.length > 0 && (
        <Container className='py-10'>
          <h2 className='font-display text-xl font-medium tracking-tight text-ink sm:text-2xl'>You may also like</h2>
          <div className='mt-6 grid grid-cols-2 gap-4 gap-y-8 sm:gap-6 lg:grid-cols-4'>
            {suggestions.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </Container>
      )}
    </div>
  )
}

export default Cart
