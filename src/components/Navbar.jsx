import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ShopContext } from '../context/ShopContext'
import Container from './ui/Container'
import { SearchIcon, UserIcon, HeartIcon, BagIcon, MenuIcon, CloseIcon } from './ui/Icons'

const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const { setShowSearch, getCartCount, getWishlistCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    // Ref to the profile menu container so we can detect outside clicks
    const profileRef = useRef(null);

    // Close the menu when clicking anywhere outside it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logout = () => {
        navigate('/login');
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
        setProfileMenuOpen(false);
    }

    const handleProfileClick = () => {
        if (!token) {
            navigate('/login');
        } else {
            setProfileMenuOpen(prev => !prev);
        }
    }

    const navLinks = [
        { to: '/', label: 'HOME' },
        { to: '/collection', label: 'COLLECTION' },
        { to: '/about', label: 'ABOUT' },
        { to: '/contact', label: 'CONTACT' },
    ]

    const cartCount = getCartCount();
    const wishlistCount = getWishlistCount ? getWishlistCount() : 0;

    // Entrance: bar slides down, logo fades, icons stagger in. Nav links stay
    // static — navigation must be usable immediately.
    const iconGroup = {
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
    }
    const iconItem = {
        hidden: { opacity: 0, y: -6 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    }

    return (
        <>
        <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className='sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-sm'
        >
            <Container className='flex items-center justify-between py-4'>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
                >
                    <Link to='/' className='flex flex-col items-center border border-ink px-3 py-1 leading-none'>
                        <span className='text-lg font-bold tracking-wide text-ink'>HEYSAZ</span>
                        <span className='text-[9px] font-medium tracking-[0.3em] text-ink-soft'>FASHION</span>
                    </Link>
                </motion.div>

                <ul className='hidden sm:flex items-center gap-5 lg:gap-8 text-[13px] font-medium tracking-widest text-ink-soft'>
                    {navLinks.map(({ to, label }) => (
                        <li key={to}>
                            <NavLink to={to} className='flex flex-col items-center gap-1 py-1'>
                                {({ isActive }) => (
                                    <>
                                        <span
                                            className={`transition-colors duration-200 ${
                                                isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
                                            }`}
                                        >
                                            {label}
                                        </span>
                                        <span className='h-[1.5px] w-full'>
                                            {isActive && (
                                                <motion.span
                                                    layoutId='navUnderline'
                                                    className='block h-full w-full bg-ink'
                                                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                                                />
                                            )}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <motion.div variants={iconGroup} initial='hidden' animate='show' className='flex items-center gap-4 sm:gap-5 text-ink'>
                    {/* Search — navigates to /collection AND opens search */}
                    <motion.button
                        variants={iconItem}
                        type='button'
                        aria-label='Search'
                        onClick={() => {
                            setShowSearch(true);
                            navigate('/collection');
                        }}
                        className='cursor-pointer hover:opacity-70 transition-opacity'
                    >
                        <SearchIcon />
                    </motion.button>

                    {/* Profile — click to toggle dropdown; works on mobile + desktop */}
                    <motion.div variants={iconItem} className='relative' ref={profileRef}>
                        <button
                            type='button'
                            aria-label='Account'
                            onClick={handleProfileClick}
                            className='cursor-pointer hover:opacity-70 transition-opacity flex'
                        >
                            <UserIcon />
                        </button>
                        {token && profileMenuOpen && (
                            <div className='absolute right-0 pt-3 z-10'>
                                <div className='flex w-40 flex-col gap-2 rounded-xl border border-line bg-white px-5 py-4 text-sm text-ink-soft shadow-sm'>
                                    <p onClick={() => { navigate('/profile'); setProfileMenuOpen(false); }} className='cursor-pointer hover:text-ink'>My Profile</p>
                                    <p onClick={() => { navigate('/orders'); setProfileMenuOpen(false); }} className='cursor-pointer hover:text-ink'>Orders</p>
                                    <p onClick={logout} className='cursor-pointer hover:text-ink'>Logout</p>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Wishlist */}
                    <motion.div variants={iconItem} className='flex'>
                        <Link to='/wishlist' aria-label='Wishlist' className='relative hover:opacity-70 transition-opacity'>
                            <HeartIcon />
                            {wishlistCount > 0 && (
                                <p className='absolute right-[-6px] top-[-4px] aspect-square w-4 rounded-full bg-ink text-center text-[8px] leading-4 text-white'>{wishlistCount}</p>
                            )}
                        </Link>
                    </motion.div>

                    {/* Cart */}
                    <motion.div variants={iconItem} className='flex'>
                        <Link to='/cart' aria-label='Cart' className='relative hover:opacity-70 transition-opacity'>
                            <BagIcon />
                            {cartCount > 0 && (
                                <p className='absolute right-[-6px] top-[-4px] aspect-square w-4 rounded-full bg-ink text-center text-[8px] leading-4 text-white'>{cartCount}</p>
                            )}
                        </Link>
                    </motion.div>

                    <motion.button variants={iconItem} type='button' aria-label='Menu' onClick={() => setVisible(true)} className='cursor-pointer sm:hidden flex'>
                        <MenuIcon />
                    </motion.button>
                </motion.div>

            </Container>

        </motion.div>

        {/* Drawer menu for smaller screens. Lives OUTSIDE the animated navbar:
            a transformed/backdrop-filtered ancestor would trap this fixed
            overlay inside the navbar's box. Slides via transform, not width. */}
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className='fixed inset-0 z-50 bg-cream sm:hidden'
                >
                    <div className='flex h-full flex-col overflow-y-auto'>
                        <div className='flex items-center justify-between border-b border-line px-4 py-4'>
                            <span className='text-sm font-medium tracking-widest text-ink'>MENU</span>
                            <button type='button' aria-label='Close menu' onClick={() => setVisible(false)} className='cursor-pointer text-ink'>
                                <CloseIcon />
                            </button>
                        </div>
                        {navLinks.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                onClick={() => setVisible(false)}
                                to={to}
                                className={({ isActive }) =>
                                    `border-b border-line px-6 py-4 text-sm tracking-widest ${isActive ? 'bg-ink text-white' : 'text-ink-soft'}`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                        <NavLink
                            onClick={() => setVisible(false)}
                            to='/wishlist'
                            className={({ isActive }) =>
                                `border-b border-line px-6 py-4 text-sm tracking-widest ${isActive ? 'bg-ink text-white' : 'text-ink-soft'}`
                            }
                        >
                            WISHLIST
                        </NavLink>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    )
}

export default Navbar
