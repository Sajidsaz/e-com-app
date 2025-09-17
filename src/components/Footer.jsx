import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur sed dolorum possimus, exercitationem quam reprehenderit? Esse.
            </p>
        </div>

        <div>
            <p className='TXT-XL font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH </p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+94 704490444</li>
                <li>heysaz00@gmail.com</li>
            </ul>
        </div>

      </div>
      <div>
        <hr className='border border-gray-200'/>
        <p className='py-5 text-sm text-center'>&copy; 2025 heysaz.com - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
