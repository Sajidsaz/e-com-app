import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox'
 
const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title  text1={'ABOUT'} text2={'US'} />
        
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>

        <img className='w-full md:max-w-[450px] ' src={assets.about} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>

          <p>HeySaz was founded with a simple vision: create premium menswear that combines timeless style with everyday comfort.</p>
          <p>We noticed that modern men often had to choose between fashion and functionality. Our mission became clear—to design clothing that looks exceptional, feels comfortable, and fits seamlessly into everyday life.</p>
          <b className='text-gray-600 '>Our Mission</b>
          <p>Today, we continue to build collections inspired by confidence, craftsmanship, and attention to detail.</p>
        </div>

      </div>

      <div className='text-4xl py-4'>
        <Title  text1={'WHY'}   text2={'CHOOSE US'}/>

      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 '>

        <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Premium Quality</b>
          <p className='text-gray-600'>Crafted from carefully sourced fabrics that offer comfort, durability, and lasting style.</p>
          </div> 

          <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Modern Design</b>
          <p className='text-gray-600'>Contemporary silhouettes inspired by classic menswear traditions.</p>
          </div> 

          <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Fast Delivery</b>
          <p className='text-gray-600'>We prioritize fast and reliable delivery to get your products to you as quickly as possible.</p>
          </div> 

          <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Customer First</b>
          <p className='text-gray-600'>Dedicated support focused on providing a seamless shopping experience.</p>
          </div> 

      </div>

      <NewsletterBox />
      
    </div>
  )
}

export default About
