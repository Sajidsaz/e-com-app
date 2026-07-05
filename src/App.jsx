import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import AccountSection from './pages/AccountSection'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import SearchBar from './components/SearchBar'
import AnnouncementBar from './components/AnnouncementBar'
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'

const App = () => {
  const location = useLocation()
  // Checkout must feel fast — barely-there fade instead of the full transition
  const fastTransition = location.pathname === '/place-order'

  return (
    <MotionConfig reducedMotion='user'>
      <CustomCursor />
      <ScrollToTop />
      <ToastContainer
        position='top-right'
        autoClose={2500}
        transition={Slide}
        newestOnTop
        closeOnClick
        pauseOnHover
        limit={3}
      />
      <AnnouncementBar />
      <Navbar />
      <SearchBar />
      {/* No initial={false} here — it would suppress every entrance animation
          in the subtree on first load/refresh (hero reveal, section staggers) */}
      <AnimatePresence mode='wait'>
      <motion.div
        key={location.pathname}
        initial={fastTransition ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
        transition={{ duration: fastTransition ? 0.15 : 0.35, ease: 'easeOut' }}
      >
      <Routes location={location}>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/account/:section' element={<AccountSection />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
      </Routes>
      </motion.div>
      </AnimatePresence>
      <Footer />
    </MotionConfig>
  )
}

export default App
