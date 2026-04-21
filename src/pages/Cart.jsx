import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, getAvailableStock, parseKey } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const productId in cartItems) {
      for (const key in cartItems[productId]) {
        if (cartItems[productId][key] > 0) {
          // 🆕 Split "Color|Size" back into separate fields for display
          const { color, size } = parseKey(key)
          tempData.push({
            _id: productId,
            color,
            size,
            quantity: cartItems[productId][key]
          })
        }
      }
    }
    setCartData(tempData);
  }, [cartItems])

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      <div>
        {
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            if (!productData) return null
            // 🆕 look up stock for this row's specific variant
            const available = getAvailableStock(item._id, item.color, item.size);

            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-3 mt-2 flex-wrap'>
                      <p>{currency}{productData.price}</p>
                      {/* 🆕 show color AND size */}
                      <p className='px-2 py-1 border border-gray-400 bg-slate-50 text-sm'>{item.color}</p>
                      <p className='px-2 py-1 border border-gray-400 bg-slate-50 text-sm'>{item.size}</p>
                    </div>
                    <p className='text-xs text-gray-400 mt-1'>
                      {available > 0 ? `${available} in stock` : 'Out of stock'}
                    </p>
                  </div>
                </div>
                <input
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || val === '0') return;
                    const requested = Number(val);
                    const finalQty = requested > available ? available : requested;
                    // 🆕 pass color and size
                    updateQuantity(item._id, item.color, item.size, finalQty);
                  }}
                  className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                  type="number"
                  min={1}
                  max={available}
                  defaultValue={item.quantity}
                />
                {/* 🆕 pass color and size for removal */}
                <img onClick={() => updateQuantity(item._id, item.color, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
              </div>
            )
          })
        }
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black cursor-pointer text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart