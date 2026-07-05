import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import Container from '../components/ui/Container'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import StarRating from '../components/ui/StarRating'
import Accordion from '../components/ui/Accordion'
import QuantityStepper from '../components/ui/QuantityStepper'
import Reveal from '../components/ui/Reveal'
import Breadcrumbs from '../components/product/Breadcrumbs'
import ProductGallery from '../components/product/ProductGallery'
import ReviewsSection from '../components/product/ReviewsSection'
import { HowToStyleIt, CraftedWithIntention } from '../components/product/StyleSections'
import SizeGuideModal from '../components/SizeGuideModal'
import RelatedProducts from '../components/RelatedProducts'
import RecentlyViewed from '../components/RecentlyViewed'
import { HeartIcon, ShieldIcon, ReturnIcon, TruckIcon, ClockIcon, CheckIcon } from '../components/ui/Icons'
import { productInfo, colorSwatches } from '../data/productInfo'

const Product = () => {

  const { productId } = useParams()
  const {
    products, backendUrl, formatPrice, addToCart, navigate,
    toggleWishlist, isInWishlist, addRecentlyViewed,
  } = useContext(ShopContext)

  const [productData, setProductData] = useState(false)
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewSummary, setReviewSummary] = useState(null)

  useEffect(() => {
    const item = products.find(p => p._id === productId)
    if (item) setProductData(item)
  }, [productId, products])

  // Track for the "Recently Viewed" rows
  useEffect(() => {
    if (productId) addRecentlyViewed(productId)
  }, [productId])

  // Reset selections when switching products
  useEffect(() => {
    setColor('')
    setSize('')
    setQty(1)
  }, [productId])

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(backendUrl + '/api/review/list', { params: { productId } })
      if (response.data.success) {
        setReviews(response.data.reviews)
        setReviewSummary(response.data.summary)
      }
    } catch (error) {
      console.log(error)
    }
  }, [backendUrl, productId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Auto-select the first color (admin-defined variant order)
  useEffect(() => {
    if (productData && productData.variants && !color) {
      const firstColor = productData.variants[0]?.color
      if (firstColor) setColor(firstColor)
    }
  }, [productData])

  // Clear size + reset qty whenever color changes
  const handleColorChange = (newColor) => {
    setColor(newColor)
    setSize('')
    setQty(1)
  }

  // Unique colors, in the order they first appear in variants
  const colors = useMemo(() => {
    if (!productData || !productData.variants) return []
    const seen = new Set()
    const result = []
    for (const v of productData.variants) {
      if (!seen.has(v.color)) {
        seen.add(v.color)
        result.push(v.color)
      }
    }
    return result
  }, [productData])

  // Sizes (with stock) for the currently-selected color
  const sizesForColor = useMemo(() => {
    if (!productData || !productData.variants || !color) return []
    return productData.variants
      .filter(v => v.color === color)
      .map(v => ({ size: v.size, stock: v.stock }))
  }, [productData, color])

  // Stock for the selected (color, size) combo, 0 if invalid
  const selectedStock = useMemo(() => {
    if (!productData || !color || !size) return 0
    const variant = productData.variants.find(v => v.color === color && v.size === size)
    return variant?.stock ?? 0
  }, [productData, color, size])

  const allOutOfStock = useMemo(() => {
    if (!productData || !productData.variants) return false
    return productData.variants.every(v => v.stock === 0)
  }, [productData])

  const canBuy = !allOutOfStock && color && size && selectedStock > 0

  // Brief success state on the button after adding
  const [justAdded, setJustAdded] = useState(false)
  const handleAddToCart = () => {
    addToCart(productData._id, color, size, qty)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
  }

  const handleBuyNow = () => {
    if (!canBuy) return
    addToCart(productData._id, color, size, qty)
    navigate('/cart')
  }

  if (!productData) return <div className='min-h-[50vh]' />

  const wishlisted = isInWishlist(productData._id)
  const badgeLabel = productData.bestseller ? 'Bestseller' : null
  const rating = reviewSummary || productData.rating || { average: 0, count: 0 }

  const accordionItems = [
    {
      title: 'Description',
      content: (
        <p className='whitespace-pre-line'>{productData.description}</p>
      ),
    },
    {
      title: 'Materials & Care',
      content: <ul className='flex flex-col gap-1.5'>{productInfo.materialsCare.map((line, i) => <li key={i}>• {line}</li>)}</ul>,
    },
    {
      title: 'Size & Fit',
      content: <ul className='flex flex-col gap-1.5'>{productInfo.sizeFit.map((line, i) => <li key={i}>• {line}</li>)}</ul>,
    },
    {
      title: 'Shipping & Returns',
      content: <ul className='flex flex-col gap-1.5'>{productInfo.shippingReturns.map((line, i) => <li key={i}>• {line}</li>)}</ul>,
    },
  ]

  return (
    <div>
      <Container className='py-6'>

        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Collection', to: '/collection' },
          ...(productData.subCategory ? [{ label: productData.subCategory, to: `/collection?type=${encodeURIComponent(productData.subCategory)}` }] : []),
          { label: productData.name },
        ]} />

        <div className='mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]'>

          {/* Gallery */}
          <ProductGallery images={productData.image} name={productData.name} />

          {/* Info panel */}
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col items-start gap-3'>
              {badgeLabel && <Badge variant='bestseller'>{badgeLabel}</Badge>}
              <h1 className='font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl'>{productData.name}</h1>
              {rating.count > 0 && (
                <StarRating rating={rating.average} count={rating.count} showValue size={16} />
              )}
              <p className='text-2xl font-semibold text-ink'>{formatPrice(productData.price)}</p>
              <p className='max-w-lg text-sm leading-relaxed text-ink-soft'>{productData.description}</p>
            </div>

            {/* Color swatches */}
            <div>
              <p className='mb-2 text-sm text-ink'>Color: <span className='font-medium'>{color}</span></p>
              <div className='flex flex-wrap gap-2'>
                {colors.map(c => {
                  const hex = colorSwatches[String(c).toLowerCase()]
                  const isSelected = c === color
                  return hex ? (
                    <button
                      key={c}
                      type='button'
                      title={c}
                      aria-label={`Color ${c}`}
                      onClick={() => handleColorChange(c)}
                      className={`h-9 w-9 cursor-pointer rounded-full border-2 transition-all ${isSelected ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-cream' : 'border-line hover:border-ink-soft'}`}
                      style={{ backgroundColor: hex }}
                    />
                  ) : (
                    <button
                      key={c}
                      type='button'
                      onClick={() => handleColorChange(c)}
                      className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors ${isSelected ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'}`}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <p className='text-sm text-ink'>Size:</p>
                <button
                  type='button'
                  onClick={() => setSizeGuideOpen(true)}
                  className='cursor-pointer text-xs text-ink-soft underline underline-offset-4 hover:text-ink'
                >
                  Size Guide
                </button>
              </div>
              <div className='flex flex-wrap gap-2'>
                {sizesForColor.map(({ size: s, stock }) => {
                  const isOutOfStock = stock === 0
                  const isSelected = s === size
                  return (
                    <button
                      key={s}
                      type='button'
                      onClick={() => !isOutOfStock && setSize(s)}
                      disabled={isOutOfStock}
                      className={`min-w-11 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'border-ink bg-ink text-white'
                          : isOutOfStock
                            ? 'cursor-not-allowed border-line bg-cream-dark text-ink-soft line-through opacity-50'
                            : 'cursor-pointer border-line bg-white text-ink hover:border-ink'
                      }`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
              {size && (
                <p className='mt-2 text-xs text-ink-soft'>
                  {selectedStock > 0 ? `${selectedStock} in stock` : 'Out of stock'}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <p className='mb-2 text-sm text-ink'>Quantity:</p>
              <QuantityStepper value={qty} min={1} max={Math.max(1, selectedStock || 99)} onChange={setQty} />
            </div>

            {/* Actions */}
            <div className='flex flex-col gap-3'>
              <Button size='lg' arrow={!justAdded} disabled={!canBuy} onClick={handleAddToCart}>
                {allOutOfStock ? 'Out of Stock' : justAdded ? 'Added to Cart ✓' : 'Add to Cart'}
              </Button>
              <div className='flex items-center gap-3'>
                <Button size='lg' variant='light' className='flex-1' disabled={!canBuy} onClick={handleBuyNow}>
                  Buy Now
                </Button>
                <button
                  type='button'
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  onClick={() => toggleWishlist(productData._id)}
                  className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-white transition-colors ${wishlisted ? 'text-red-500' : 'text-ink hover:text-red-500'}`}
                >
                  <HeartIcon filled={wishlisted} />
                </button>
              </div>
            </div>

            {/* Trust icons */}
            <div className='grid grid-cols-4 gap-2 border-y border-line py-5 text-center'>
              {[
                { icon: ShieldIcon, label: 'Secure Checkout' },
                { icon: ReturnIcon, label: '7-Day Easy Returns' },
                { icon: TruckIcon, label: 'Fast Delivery' },
                { icon: CheckIcon, label: 'Authentic Quality' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className='flex flex-col items-center gap-1.5'>
                  <Icon className='w-5 h-5 text-ink' />
                  <p className='text-[11px] leading-tight text-ink-soft'>{label}</p>
                </div>
              ))}
            </div>

            {/* Delivery info strip */}
            <div className='flex flex-col gap-2.5 rounded-2xl bg-cream-dark p-4 text-sm text-ink-soft'>
              <p className='flex items-center gap-2.5'><ClockIcon className='w-4 h-4 shrink-0' /> Estimated delivery: 2–4 business days</p>
              <p className='flex items-center gap-2.5'><CheckIcon className='w-4 h-4 shrink-0' /> Cash on Delivery available</p>
              <p className='flex items-center gap-2.5'><TruckIcon className='w-4 h-4 shrink-0' /> Free delivery on orders over Rs. 15,000</p>
            </div>

          </div>
        </div>

        {/* Details accordion */}
        <div className='mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]'>
          <p className='hidden text-sm font-medium text-ink lg:block'>Product Details</p>
          <Accordion items={accordionItems} />
        </div>

        <Reveal>
          <HowToStyleIt category={productData.category} subCategory={productData.subCategory} excludeId={productData._id} />
        </Reveal>

        <Reveal>
          <CraftedWithIntention images={productData.image} />
        </Reveal>

        <ReviewsSection
          productId={productData._id}
          reviews={reviews}
          summary={reviewSummary}
          onRefresh={fetchReviews}
        />

        <Reveal>
          <RelatedProducts category={productData.category} subCategory={productData.subCategory} excludeId={productData._id} />
        </Reveal>

      </Container>

      <RecentlyViewed excludeId={productData._id} />

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} category={productData.subCategory} />
    </div>
  )
}

export default Product
