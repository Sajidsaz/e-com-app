import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Container from '../components/ui/Container'
import ArchImage from '../components/ui/ArchImage'
import ProductCard from '../components/ProductCard'
import FilterBar, { PRICE_RANGES } from '../components/collection/FilterBar'
import PromoBanner from '../components/collection/PromoBanner'
import TrustStrip from '../components/TrustStrip'
import RecentlyViewed from '../components/RecentlyViewed'
import Reveal from '../components/ui/Reveal'
import { CATEGORIES, COLLECTION_TABS, isNewIn } from '../utils/categories'

const EMPTY_FILTERS = { categories: [], sizes: [], colors: [], prices: [], inStock: false }

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const typeParam = searchParams.get('type')
  const activeTab = COLLECTION_TABS.includes(typeParam) ? typeParam : 'All'

  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [sortType, setSortType] = useState('newest')

  const setActiveTab = (tab) => {
    setSearchParams(tab === 'All' ? {} : { type: tab }, { replace: true })
  }

  // Size/color options derived from what actually exists in the catalog
  const options = useMemo(() => {
    const sizes = new Set()
    const colors = new Set()
    for (const product of products) {
      for (const variant of product.variants || []) {
        if (variant.size) sizes.add(variant.size)
        if (variant.color) colors.add(variant.color)
      }
    }
    return { categories: CATEGORIES, sizes: [...sizes], colors: [...colors] }
  }, [products])

  const filtered = useMemo(() => {
    let list = [...products]

    if (activeTab === 'New In') {
      list = list.filter(isNewIn)
    } else if (activeTab !== 'All') {
      list = list.filter(item => item.subCategory === activeTab)
    }

    if (showSearch && search) {
      list = list.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (filters.categories.length) {
      list = list.filter(item => filters.categories.includes(item.category))
    }
    if (filters.sizes.length) {
      list = list.filter(item => (item.variants || []).some(v => filters.sizes.includes(v.size)))
    }
    if (filters.colors.length) {
      list = list.filter(item => (item.variants || []).some(v => filters.colors.includes(v.color)))
    }
    if (filters.prices.length) {
      const ranges = PRICE_RANGES.filter(r => filters.prices.includes(r.label))
      list = list.filter(item => ranges.some(r => item.price >= r.min && item.price < r.max))
    }
    if (filters.inStock) {
      list = list.filter(item => (item.variants || []).some(v => (v.stock || 0) > 0))
    }

    switch (sortType) {
      case 'low-high':
        list.sort((a, b) => a.price - b.price)
        break
      case 'high-low':
        list.sort((a, b) => b.price - a.price)
        break
      default:
        list.sort((a, b) => (b.date || 0) - (a.date || 0))
    }

    return list
  }, [products, activeTab, search, showSearch, filters, sortType])

  return (
    <div>

      {/* Header band */}
      {/* <section className='w-full bg-cream'>
        <Container className='grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-2'>
          <div className='flex flex-col gap-3'>
            <h1 className='font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl'>The Collection</h1>
            <p className='max-w-sm text-sm text-ink-soft sm:text-base'>
              Premium menswear essentials designed for confidence, comfort, and modern living.
            </p>
          </div>
          <div className='hidden grid-cols-[1.3fr_1fr_0.7fr] items-end gap-4 lg:grid'>
            <ArchImage src={assets.hero_img} alt='Collection featured look' className='aspect-[3/4] w-full' />
            <ArchImage src={assets.model2} alt='Casual look' className='aspect-[3/4] w-full' />
            <div className='overflow-hidden rounded-2xl'>
              <img src={assets.hero_img1} alt='Fabric detail' loading='lazy' className='aspect-[3/4] w-full object-cover' />
            </div>
          </div>
        </Container>
      </section> */}

      <Container className='pt-6'>

        {/* Category tabs */}
        <div className='flex gap-6 overflow-x-auto border-b border-line pb-0 text-sm'>
          {COLLECTION_TABS.map(tab => (
            <button
              key={tab}
              type='button'
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 cursor-pointer border-b-2 pb-3 font-medium transition-colors ${activeTab === tab ? 'border-ink text-ink' : 'border-transparent text-ink-soft hover:text-ink'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className='py-5'>
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            options={options}
            sortType={sortType}
            setSortType={setSortType}
          />
        </div>

        {/* Product grid */}
        <div className='grid grid-cols-2 gap-4 gap-y-8 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
          {products.length === 0
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className='animate-pulse'>
                  <div className='aspect-[3/4] w-full rounded-xl bg-cream-dark' />
                  <div className='mt-3 h-3 w-3/4 rounded bg-cream-dark' />
                  <div className='mt-2 h-3 w-1/4 rounded bg-cream-dark' />
                </div>
              ))
            : filtered.map((item, index) => (
                <ProductCard key={item._id} product={item} index={index} />
              ))}
        </div>

        {products.length > 0 && filtered.length === 0 && (
          <p className='py-16 text-center text-sm text-ink-soft'>
            No products match your filters. Try clearing a filter or two.
          </p>
        )}

      </Container>

      <Reveal><TrustStrip /></Reveal>
      <Reveal><PromoBanner /></Reveal>
      <RecentlyViewed />

    </div>
  )
}

export default Collection
