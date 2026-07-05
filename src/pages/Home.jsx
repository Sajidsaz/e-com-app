import React from 'react'
import HomeHero from '../components/home/HomeHero'
import TrustStrip from '../components/TrustStrip'
import CategoryTiles from '../components/home/CategoryTiles'
import NewArrivals from '../components/home/NewArrivals'
import OurStory from '../components/home/OurStory'
import FeaturedLook from '../components/home/FeaturedLook'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import Reveal from '../components/ui/Reveal'

// Sections choreograph their own scroll reveals; only Newsletter still uses
// the generic Reveal wrapper.
const Home = () => {
  return (
    <div>
      <HomeHero />
      <TrustStrip />
      <CategoryTiles />
      <NewArrivals />
      <OurStory />
      <FeaturedLook />
      <Testimonials />
      <Reveal><Newsletter /></Reveal>
    </div>
  )
}

export default Home
