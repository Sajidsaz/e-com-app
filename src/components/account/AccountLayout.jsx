import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShopContext } from '../../context/ShopContext'
import Container from '../ui/Container'

// Full account menu per the mockup. Sections without backend support yet
// route to a "coming soon" placeholder (see AccountSection page).
export const ACCOUNT_MENU = [
  { label: 'My Orders', to: '/orders' },
  { label: 'Profile', to: '/profile' },
  { label: 'Addresses', to: '/account/addresses', placeholder: true },
  { label: 'Payment Methods', to: '/account/payment-methods', placeholder: true },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Size Preferences', to: '/account/size-preferences', placeholder: true },
  { label: 'Notifications', to: '/account/notifications', placeholder: true },
  { label: 'Help Center', to: '/contact' },
]

const AccountLayout = ({ children }) => {
  const { navigate, setToken, setCartItems } = useContext(ShopContext)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  return (
    <Container className='py-10'>
      <div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-[230px_1fr]'>

        {/* Sidebar */}
        <aside className='rounded-2xl border border-line bg-white p-4 lg:sticky lg:top-24'>
          <p className='px-3 pb-3 text-sm font-semibold text-ink'>My Account</p>
          <nav className='flex flex-col gap-0.5'>
            {ACCOUNT_MENU.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `relative rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive ? 'font-medium text-white' : 'text-ink-soft hover:bg-cream hover:text-ink'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Shared layoutId makes the pill slide between items */}
                    {isActive && (
                      <motion.span
                        layoutId='accountActivePill'
                        className='absolute inset-0 rounded-xl bg-ink'
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className='relative z-10'>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
            <button
              type='button'
              onClick={logout}
              className='mt-2 cursor-pointer rounded-xl border-t border-line px-3 py-2.5 pt-4 text-left text-sm text-ink-soft transition-colors hover:text-red-500'
            >
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className='min-w-0'>{children}</div>

      </div>
    </Container>
  )
}

export default AccountLayout
