import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({id, image, name, price}) => {

    const {currency} = useContext(ShopContext);

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
        <div className='aspect-[3/4] overflow-hidden rounded-sm'>
            <img
                className='h-full w-full object-cover hover:scale-110 transition ease-in-out'
                src={image[0]}
                alt={name}
                loading='lazy'
                decoding='async'
            />

        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem
