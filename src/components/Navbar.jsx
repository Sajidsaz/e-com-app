import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShopContext } from '../context/ShopContext';
import { useAnimationGate } from '../context/AnimationGateContext';

const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);   // 🆕

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);
    const { ready } = useAnimationGate();

    // 🆕 Ref to the profile menu container so we can detect outside clicks
    const profileRef = useRef(null);

    // 🆕 Close the menu when clicking anywhere outside it
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
        setProfileMenuOpen(false);   // 🆕 close menu on logout
    }

    // 🆕 Handler for profile icon click
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

    return (
        <motion.div
            className='flex items-center justify-between py-5 font-medium'
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >

            <Link to='/' className='flex flex-col items-center border border-gray-800 px-3 py-1 leading-none'>
                <span className='text-lg font-bold tracking-wide text-[#1a1a1a]'>HEYSAZ</span>
                <span className='text-[9px] font-medium tracking-[0.3em] text-gray-500'>FASHION</span>
            </Link>

            <ul className='hidden sm:flex items-center gap-5 lg:gap-7 text-sm text-gray-700'>
                {navLinks.map(({ to, label }) => (
                    <li key={to}>
                        <NavLink to={to} className='flex flex-col items-center gap-1 py-1'>
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`transition-colors duration-200 ${
                                            isActive ? 'text-black' : 'text-gray-700 hover:text-black'
                                        }`}
                                    >
                                        {label}
                                    </span>
                                    <span className='h-[1.5px] w-full'>
                                        {isActive && (
                                            <motion.span
                                                layoutId='navUnderline'
                                                className='block h-full w-full bg-gray-800'
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

            <div className='flex items-center gap-6'>
                {/* Search icon — navigates to /collection AND opens search */}
                <img
                    onClick={() => {
                        setShowSearch(true);
                        navigate('/collection');
                    }}
                    src={assets.search_icon}
                    alt="search icon"
                    className='w-5 cursor-pointer'
                />

                {/* 🆕 Profile icon — click to toggle dropdown; works on mobile + desktop */}
                <div className='relative' ref={profileRef}>
                    <img
                        onClick={handleProfileClick}
                        src={assets.profile_icon}
                        alt="profile icon"
                        className='w-5 cursor-pointer'
                    />
                    {token && profileMenuOpen && (
                        <div className='absolute dropdown-menu right-0 pt-4 z-10'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                               <p onClick={() => { navigate('/profile'); setProfileMenuOpen(false); }} 
    className='cursor-pointer hover:text-black'>My Profile</p>
                                <p onClick={() => { navigate('/orders'); setProfileMenuOpen(false); }} className='cursor-pointer hover:text-black'>Orders</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                            </div>
                        </div>
                    )}
                </div>

                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} alt="cart icon" className='w-5 min-w-5' />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} alt="menu icon" className='w-5 cursor-pointer sm:hidden' />
            </div>

            {/* Sidebar menu for smaller screens */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="dropdown icon" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/collection'>COLLECTION</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/about'>ABOUT</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/contact'>CONTACT</NavLink>
                </div>
            </div>

        </motion.div>
    )
}

export default Navbar