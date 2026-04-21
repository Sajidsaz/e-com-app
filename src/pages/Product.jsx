import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
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

  // 🆕 Helper: find the stock for the currently-selected size
  const selectedStock = productData
    ? productData.sizes.find(s => s.size === size)?.stock ?? 0
    : 0

  // 🆕 Helper: is the product fully out of stock (every size 0)?
  const allOutOfStock = productData
    ? productData.sizes.every(s => s.stock === 0)
    : false

  return productData ? (
    <div className='border-t pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* product data */}
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

        {/* product info */}
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

          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2 flex-wrap'>
              {/* 🆕 Destructure {size, stock} from each item, disable when out of stock */}
              {productData.sizes.map((item, index) => {
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

            {/* 🆕 Show stock info for the selected size */}
            {size && (
              <p className='text-sm text-gray-500'>
                {selectedStock > 0
                  ? `${selectedStock} in stock`
                  : 'Out of stock'}
              </p>
            )}
          </div>

          {/* 🆕 Disable Add to Cart when no size selected, selected size is OOS, or whole product OOS */}
          <button
            onClick={() => addToCart(productData._id, size)}
            disabled={allOutOfStock || !size || selectedStock === 0}
            className={`
              px-8 py-3 text-sm text-white
              ${allOutOfStock || !size || selectedStock === 0
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