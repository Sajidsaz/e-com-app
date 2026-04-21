import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [color, setColor] = useState('');     // 🆕 selected color
  const [size, setSize] = useState('');

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  // 🆕 Auto-select the first color when product data loads (Decision 1-A).
  // Picking the first color alphabetically isn't right — we want the order
  // the admin set. So we use the FIRST UNIQUE color in the variants array.
  useEffect(() => {
    if (productData && productData.variants && !color) {
      const firstColor = productData.variants[0]?.color
      if (firstColor) setColor(firstColor)
    }
  }, [productData])

  // 🆕 Clear size whenever color changes (Decision 2-B).
  // Derived from the color setter: we reset size every time user picks a color.
  const handleColorChange = (newColor) => {
    setColor(newColor)
    setSize('')
  }

  // 🆕 List of unique colors, in the order they first appear in variants
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

  // 🆕 List of unique sizes for the currently-selected color
  const sizesForColor = useMemo(() => {
    if (!productData || !productData.variants || !color) return []
    return productData.variants
      .filter(v => v.color === color)
      .map(v => ({ size: v.size, stock: v.stock }))
  }, [productData, color])

  // 🆕 Stock for the currently selected (color, size) combo, 0 if invalid
  const selectedStock = useMemo(() => {
    if (!productData || !color || !size) return 0
    const variant = productData.variants.find(
      v => v.color === color && v.size === size
    )
    return variant?.stock ?? 0
  }, [productData, color, size])

  // 🆕 Is every variant of this product out of stock?
  const allOutOfStock = useMemo(() => {
    if (!productData || !productData.variants) return false
    return productData.variants.every(v => v.stock === 0)
  }, [productData])

  // 🆕 Handler for add-to-cart — passes color AND size to context
  const handleAddToCart = () => {
    addToCart(productData._id, color, size)
  }

  return productData ? (
    <div className='border-t pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt='' />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* Product info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_dull_icon} alt="" className="w-3" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* 🆕 Color picker */}
          <div className='flex flex-col gap-3 my-6'>
            <p>Select Color</p>
            <div className='flex gap-2 flex-wrap'>
              {colors.map((c, index) => {
                const isSelected = c === color
                return (
                  <button
                    key={index}
                    onClick={() => handleColorChange(c)}
                    className={`
                      border py-2 px-4 bg-gray-100 cursor-pointer
                      ${isSelected ? 'border-orange-500' : 'border-gray-200'}
                    `}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Size picker — depends on selected color */}
          <div className='flex flex-col gap-3 my-6'>
            <p>Select Size</p>
            <div className='flex gap-2 flex-wrap'>
              {sizesForColor.map((item, index) => {
                const isOutOfStock = item.stock === 0
                const isSelected = item.size === size
                return (
                  <button
                    key={index}
                    onClick={() => !isOutOfStock && setSize(item.size)}
                    disabled={isOutOfStock}
                    className={`
                      border border-gray-200 py-2 px-4 bg-gray-100
                      ${isSelected ? 'border-orange-500' : ''}
                      ${isOutOfStock ? 'opacity-40 line-through cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {item.size}
                  </button>
                )
              })}
            </div>

            {/* Stock hint when size is selected */}
            {size && (
              <p className='text-sm text-gray-500'>
                {selectedStock > 0 ? `${selectedStock} in stock` : 'Out of stock'}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={allOutOfStock || !color || !size || selectedStock === 0}
            className={`
              px-8 py-3 text-sm text-white
              ${allOutOfStock || !color || !size || selectedStock === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black active:bg-gray-700 cursor-pointer'}
            `}
          >
            {allOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>

          <hr className='mt-8 sm:w-4/5 border-gray-100' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p className='text-gray-400'>100% Original Product.</p>
            <p className='text-gray-400'>Cash on Delivery is available on this product.</p>
            <p className='text-gray-400'>Easy return & exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* description & review */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews(122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p className='text-gray-400'>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
          <p className='text-gray-400'>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product