import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { ShieldIcon, ReturnIcon, TruckIcon, CheckIcon } from '../components/ui/Icons'
import { getEffectivePrice } from '../utils/format'

const inputCls = 'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink'

const DELIVERY_OPTIONS = [
    { id: 'standard', label: 'Standard Delivery', detail: '2–4 business days', price: 'Free', enabled: true },
    { id: 'express', label: 'Express Delivery', detail: '1–2 business days', price: 'Rs. 500', enabled: false },
    { id: 'nextday', label: 'Next Day Delivery', detail: 'Order by 2 PM', price: 'Rs. 1,000', enabled: false },
]

const PAYMENT_OPTIONS = [
    { id: 'cod', label: 'Cash on Delivery', detail: 'Pay when you receive', enabled: true },
    { id: 'card', label: 'Credit / Debit Card', detail: 'Visa, Mastercard, AMEX', enabled: false },
    { id: 'bank', label: 'Bank Transfer', detail: 'Manual bank transfer', enabled: false },
]

const PlaceOrder = () => {

    const [method, setMethod] = useState('cod');
    const [placing, setPlacing] = useState(false);
    const {
        navigate, backendUrl, token, cartItems, setCartItems, getCartAmount,
        products, parseKey, formatPrice,
        isVerified, getUserVerifiedStatus
    } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        street: '', city: '', state: '',
        zipcode: '', country: '', phone: ''
    })

    // 'idle' | 'sending' | 'sent' — drives the resend button label/state
    const [resendState, setResendState] = useState('idle')

    // Flatten the cart for the order summary
    const [summaryItems, setSummaryItems] = useState([])
    useEffect(() => {
        const items = []
        for (const productId in cartItems) {
            for (const key in cartItems[productId]) {
                if (cartItems[productId][key] > 0) {
                    const product = products.find(p => p._id === productId)
                    if (product) {
                        const { color, size } = parseKey(key)
                        items.push({ product, color, size, quantity: cartItems[productId][key] })
                    }
                }
            }
        }
        setSummaryItems(items)
    }, [cartItems, products])

    const subtotal = getCartAmount()

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }))
    }

    const handleResendVerification = async () => {
        setResendState('sending')
        try {
            const response = await axios.post(
                backendUrl + '/api/user/resend-verification',
                {},
                { headers: { token } }
            )
            if (response.data.success) {
                setResendState('sent')
                toast.success('Verification email sent. Check your inbox.')
            } else {
                setResendState('idle')
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            setResendState('idle')
            toast.error(error?.response?.data?.message || 'Something went wrong')
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setPlacing(true)
        try {
            let orderItems = [];

            // cartItems keys are "Color|Size" — split them back out
            for (const productId in cartItems) {
                for (const key in cartItems[productId]) {
                    if (cartItems[productId][key] > 0) {
                        const itemInfo = structuredClone(products.find(p => p._id === productId));
                        if (itemInfo) {
                            const { color, size } = parseKey(key)
                            itemInfo.color = color
                            itemInfo.size = size
                            itemInfo.quantity = cartItems[productId][key];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount()  // backend recalculates anyway, this is just informational
            }

            switch (method) {
                case 'cod': {
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                    if (response.data.success) {
                        setCartItems({})
                        if (response.data.orderNumber) {
                            toast.success(`Order placed! Your order number is ${response.data.orderNumber}`)
                        }
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;
                }
                default:
                    break;
            }

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setPlacing(false)
        }
    }

    // Verification wall — shown when user is not verified.
    // Backend also blocks placeOrder server-side; this is the friendly UI version.
    if (!isVerified) {
        return (
            <Container className='py-20'>
                <div className='mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-line bg-white px-6 py-14 text-center'>
                    <ShieldIcon className='w-8 h-8 text-ink' />
                    <h1 className='font-display text-2xl font-medium text-ink'>Verify Your Email</h1>
                    <p className='text-sm leading-relaxed text-ink-soft'>
                        Please verify your email address before placing an order.
                        We sent you a verification link when you signed up — check your inbox (and spam folder).
                    </p>
                    <Button
                        onClick={handleResendVerification}
                        disabled={resendState !== 'idle'}
                    >
                        {resendState === 'idle' && 'Resend Verification Email'}
                        {resendState === 'sending' && 'Sending…'}
                        {resendState === 'sent' && 'Email Sent ✓'}
                    </Button>
                    <p className='text-xs text-ink-soft'>
                        Already verified?{' '}
                        <span
                            className='cursor-pointer underline underline-offset-4'
                            onClick={() => getUserVerifiedStatus(token)}
                        >
                            Refresh status
                        </span>
                    </p>
                </div>
            </Container>
        )
    }

    return (
        <Container className='py-10'>
            <h1 className='font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl'>Checkout</h1>

            {/* Step indicator (single-page checkout; Payment & Review live below) */}
            <div className='mt-4 flex items-center gap-3 text-xs'>
                {['Delivery', 'Payment', 'Review'].map((step, i) => (
                    <div key={step} className='flex items-center gap-3'>
                        {i > 0 && <span className='h-px w-8 bg-line sm:w-14' />}
                        <span className='flex items-center gap-2'>
                            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${i === 0 ? 'bg-ink text-white' : 'border border-line text-ink-soft'}`}>{i + 1}</span>
                            <span className={i === 0 ? 'font-medium text-ink' : 'text-ink-soft'}>{step}</span>
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={onSubmitHandler} className='mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.7fr_1fr]'>

                {/* Left: delivery + options + payment */}
                <div className='flex flex-col gap-6'>

                    {/* Delivery details */}
                    <div className='rounded-2xl border border-line bg-white p-6'>
                        <h2 className='text-base font-semibold text-ink'>Delivery Details</h2>
                        <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className={inputCls} type='text' placeholder='First Name' />
                            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className={inputCls} type='text' placeholder='Last Name' />
                            <input required onChange={onChangeHandler} name='email' value={formData.email} className={inputCls} type='email' placeholder='Email' />
                            <input required onChange={onChangeHandler} name='phone' value={formData.phone} className={inputCls} type='tel' placeholder='Phone' />
                            <input required onChange={onChangeHandler} name='street' value={formData.street} className={`${inputCls} sm:col-span-2`} type='text' placeholder='Address (street, apartment, suite…)' />
                            <input required onChange={onChangeHandler} name='city' value={formData.city} className={inputCls} type='text' placeholder='City' />
                            <input required onChange={onChangeHandler} name='state' value={formData.state} className={inputCls} type='text' placeholder='State / Province' />
                            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className={inputCls} type='text' inputMode='numeric' placeholder='Postal Code' />
                            <input required onChange={onChangeHandler} name='country' value={formData.country} className={inputCls} type='text' placeholder='Country' />
                        </div>
                    </div>

                    {/* Delivery options */}
                    <div className='rounded-2xl border border-line bg-white p-6'>
                        <h2 className='text-base font-semibold text-ink'>Delivery Options</h2>
                        <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3'>
                            {DELIVERY_OPTIONS.map(({ id, label, detail, price, enabled }) => (
                                <div
                                    key={id}
                                    className={`relative flex flex-col gap-1 rounded-xl border p-4 ${enabled ? 'border-ink bg-cream' : 'border-line opacity-60'}`}
                                >
                                    <div className='flex items-center gap-2'>
                                        <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${enabled ? 'border-ink bg-ink text-white' : 'border-line'}`}>
                                            {enabled && <CheckIcon className='w-2.5 h-2.5' />}
                                        </span>
                                        <p className='text-sm font-medium text-ink'>{label}</p>
                                    </div>
                                    <p className='pl-6 text-xs text-ink-soft'>{detail}</p>
                                    <p className='pl-6 text-xs font-semibold text-ink'>{price}</p>
                                    {!enabled && <Badge variant='neutral' className='absolute right-3 top-3'>Soon</Badge>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment method */}
                    <div className='rounded-2xl border border-line bg-white p-6'>
                        <h2 className='text-base font-semibold text-ink'>Payment Method</h2>
                        <div className='mt-4 flex flex-col gap-3'>
                            {PAYMENT_OPTIONS.map(({ id, label, detail, enabled }) => {
                                const selected = method === id
                                return (
                                    <button
                                        key={id}
                                        type='button'
                                        disabled={!enabled}
                                        onClick={() => enabled && setMethod(id)}
                                        className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                                            selected ? 'border-ink bg-cream' : enabled ? 'cursor-pointer border-line hover:border-ink' : 'border-line opacity-60'
                                        }`}
                                    >
                                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-ink bg-ink text-white' : 'border-line'}`}>
                                            {selected && <CheckIcon className='w-2.5 h-2.5' />}
                                        </span>
                                        <div className='flex-1'>
                                            <p className='text-sm font-medium text-ink'>{label}</p>
                                            <p className='text-xs text-ink-soft'>{detail}</p>
                                        </div>
                                        {!enabled && <Badge variant='neutral'>Coming Soon</Badge>}
                                    </button>
                                )
                            })}
                        </div>
                        <p className='mt-4 flex items-center gap-2 text-xs text-ink-soft'>
                            <ShieldIcon className='w-3.5 h-3.5' /> Your details are encrypted and protected
                        </p>
                    </div>

                </div>

                {/* Right: order summary */}
                <div className='flex flex-col gap-4 lg:sticky lg:top-24'>
                    <div className='rounded-2xl border border-line bg-white p-6'>
                        <h2 className='text-base font-semibold text-ink'>Order Summary</h2>

                        <div className='mt-4 flex flex-col gap-3'>
                            {summaryItems.map(({ product, color, size, quantity }) => (
                                <div key={`${product._id}-${color}-${size}`} className='flex items-center gap-3'>
                                    <div className='h-14 w-12 shrink-0 overflow-hidden rounded-lg'>
                                        <img src={product.image?.[0]} alt={product.name} className='h-full w-full object-cover' />
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                        <p className='truncate text-xs font-medium text-ink'>{product.name}</p>
                                        <p className='text-[11px] text-ink-soft'>{color} / {size} × {quantity}</p>
                                    </div>
                                    <p className='text-xs font-semibold text-ink'>{formatPrice(getEffectivePrice(product).price * quantity)}</p>
                                </div>
                            ))}
                        </div>

                        <div className='mt-5 flex flex-col gap-2.5 border-t border-line pt-4 text-sm'>
                            <div className='flex justify-between text-ink-soft'>
                                <span>Subtotal</span><span className='text-ink'>{formatPrice(subtotal)}</span>
                            </div>
                            <div className='flex justify-between text-ink-soft'>
                                <span>Shipping</span><span className='text-ink'>Free</span>
                            </div>
                            <div className='mt-1 flex justify-between border-t border-line pt-3 text-base font-semibold text-ink'>
                                <span>Total</span><span>{formatPrice(subtotal)}</span>
                            </div>
                        </div>

                        <Button type='submit' size='lg' arrow disabled={placing || summaryItems.length === 0} className='mt-5 w-full'>
                            {placing ? 'Placing Order…' : 'Place Order'}
                        </Button>
                    </div>

                    <div className='flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 text-sm'>
                        {[
                            { icon: ShieldIcon, title: 'Secure Checkout', text: '100% secure payments' },
                            { icon: ReturnIcon, title: '7-Day Easy Returns', text: 'Hassle-free returns' },
                            { icon: TruckIcon, title: 'Fast Delivery', text: 'Delivered in 2–4 days' },
                        ].map(({ icon: Icon, title, text }) => (
                            <div key={title} className='flex items-center gap-3'>
                                <Icon className='w-5 h-5 shrink-0 text-ink' />
                                <div>
                                    <p className='text-sm font-medium text-ink'>{title}</p>
                                    <p className='text-xs text-ink-soft'>{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </form>
        </Container>
    )
}

export default PlaceOrder
