import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import AccountLayout from '../components/account/AccountLayout'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { PhoneIcon, ReturnIcon, ShieldIcon } from '../components/ui/Icons'
import { contactContent } from '../data/contactContent'

const Profile = () => {

    const { token, backendUrl, navigate, getWishlistCount } = useContext(ShopContext)
    const [profile, setProfile] = useState(null)
    const [orderCount, setOrderCount] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // If not logged in, bounce to login
        if (!token) {
            navigate('/login')
            return
        }

        const fetchProfile = async () => {
            try {
                const [meRes, ordersRes] = await Promise.all([
                    axios.get(backendUrl + '/api/user/me', { headers: { token } }),
                    axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } }).catch(() => null),
                ])

                if (meRes.data.success) {
                    setProfile(meRes.data.user)
                } else {
                    toast.error(meRes.data.message)
                }
                if (ordersRes?.data?.success) {
                    setOrderCount(ordersRes.data.orders.length)
                }
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message || error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [token])

    if (loading) {
        return (
            <AccountLayout>
                <div className='rounded-2xl border border-line bg-white px-6 py-20 text-center text-sm text-ink-soft'>Loading…</div>
            </AccountLayout>
        )
    }

    if (!profile) {
        return (
            <AccountLayout>
                <div className='rounded-2xl border border-line bg-white px-6 py-20 text-center text-sm text-ink-soft'>Could not load profile.</div>
            </AccountLayout>
        )
    }

    const memberSince = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : null

    const initials = (profile.name || '?')
        .split(' ')
        .map(part => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    const stats = [
        { value: orderCount ?? '—', label: 'Orders', to: '/orders' },
        { value: getWishlistCount(), label: 'Wishlist', to: '/wishlist' },
    ]

    const placeholderCards = [
        { title: 'Default Address', text: 'Save a delivery address for faster checkout.', cta: 'Add Address' },
        { title: 'Payment Methods', text: 'Manage saved payment options.', cta: 'Manage' },
        { title: 'Size Preferences', text: 'Save your sizes for tailored recommendations.', cta: 'Edit Sizes' },
    ]

    return (
        <AccountLayout>
            <div className='grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_240px]'>

                <div className='flex min-w-0 flex-col gap-5'>
                    <h1 className='font-display text-2xl font-semibold tracking-tight text-ink'>Profile</h1>

                    {/* Header card */}
                    <div className='flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-white p-6'>
                        <span className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xl font-semibold text-white'>
                            {initials}
                        </span>
                        <div className='min-w-0 flex-1'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <p className='text-lg font-semibold text-ink'>{profile.name}</p>
                                {profile.isVerified && <Badge variant='neutral'>Verified</Badge>}
                            </div>
                            <p className='truncate text-sm text-ink-soft'>{profile.email}</p>
                            {memberSince && <p className='text-xs text-ink-soft'>Member since {memberSince}</p>}
                        </div>
                        <div className='flex gap-3'>
                            {stats.map(({ value, label, to }) => (
                                <Link key={label} to={to} className='flex min-w-20 flex-col items-center gap-0.5 rounded-xl border border-line px-4 py-3 transition-colors hover:border-ink'>
                                    <p className='font-display text-xl font-semibold text-ink'>{value}</p>
                                    <p className='text-xs text-ink-soft'>{label}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Personal details */}
                    <div className='rounded-2xl border border-line bg-white p-6'>
                        <h2 className='text-base font-semibold text-ink'>Personal Details</h2>
                        <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            <div>
                                <p className='mb-1.5 text-xs text-ink-soft'>Full Name</p>
                                <p className='rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink'>{profile.name}</p>
                            </div>
                            <div>
                                <p className='mb-1.5 text-xs text-ink-soft'>Email</p>
                                <p className='truncate rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink'>{profile.email}</p>
                            </div>
                        </div>
                        <Button
                            size='sm'
                            variant='outline'
                            className='mt-4'
                            onClick={() => toast.info('Profile editing is coming soon!')}
                        >
                            Edit Details
                        </Button>
                    </div>

                    {/* Coming-soon feature cards */}
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                        {placeholderCards.map(({ title, text, cta }) => (
                            <div key={title} className='flex flex-col gap-2 rounded-2xl border border-line bg-white p-5'>
                                <div className='flex items-center justify-between gap-2'>
                                    <p className='text-sm font-semibold text-ink'>{title}</p>
                                    <Badge variant='neutral'>Soon</Badge>
                                </div>
                                <p className='flex-1 text-xs leading-relaxed text-ink-soft'>{text}</p>
                                <Button size='sm' variant='outline' className='self-start' onClick={() => toast.info(`${title} is coming soon!`)}>
                                    {cta}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Help rail */}
                <aside className='flex flex-col gap-4'>
                    <div className='rounded-2xl border border-line bg-white p-5'>
                        <p className='text-sm font-semibold text-ink'>Need Help?</p>
                        <p className='mt-1 text-xs text-ink-soft'>We're here for you.</p>
                        <div className='mt-4 flex flex-col gap-3'>
                            <a href={contactContent.whatsapp} target='_blank' rel='noreferrer' className='flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:border-ink'>
                                <PhoneIcon className='w-4 h-4 shrink-0 text-ink' />
                                <div>
                                    <p className='text-xs font-medium text-ink'>WhatsApp Support</p>
                                    <p className='text-[11px] text-ink-soft'>Chat with our team</p>
                                </div>
                            </a>
                            <Link to='/contact' className='flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:border-ink'>
                                <ReturnIcon className='w-4 h-4 shrink-0 text-ink' />
                                <div>
                                    <p className='text-xs font-medium text-ink'>Returns & Exchanges</p>
                                    <p className='text-[11px] text-ink-soft'>7-day easy returns</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className='rounded-2xl border border-line bg-white p-5'>
                        <p className='flex items-center gap-2 text-sm font-semibold text-ink'>
                            <ShieldIcon className='w-4 h-4' /> Secure & Private
                        </p>
                        <p className='mt-2 text-xs leading-relaxed text-ink-soft'>
                            Your data is safe with us. We never share your information.
                        </p>
                    </div>
                </aside>

            </div>
        </AccountLayout>
    )
}

export default Profile
