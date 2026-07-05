import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import AccountLayout from '../components/account/AccountLayout'
import Button from '../components/ui/Button'
import { CheckIcon, BagIcon } from '../components/ui/Icons'

// Stored status sequence with customer-facing labels (mirrors /api/order/track)
const STATUS_STEPS = [
  { status: 'Order Placed', label: 'Placed' },
  { status: 'Packing', label: 'Confirmed' },
  { status: 'Shipped', label: 'Shipped' },
  { status: 'Out for delivery', label: 'Out for Delivery' },
  { status: 'Delivered', label: 'Delivered' },
]

const TABS = ['Active', 'Completed', 'Cancelled']

const statusBadgeCls = (status) => {
  if (status === 'Delivered') return 'bg-green-100 text-green-800'
  if (status === 'Cancelled') return 'bg-red-100 text-red-700'
  return 'bg-cream-dark text-ink'
}

const OrderTimeline = ({ status }) => {
  const currentIndex = STATUS_STEPS.findIndex(s => s.status === status)
  return (
    <div className='flex items-start'>
      {STATUS_STEPS.map((step, i) => {
        const done = currentIndex >= 0 && i <= currentIndex
        return (
          <div key={step.label} className='flex flex-1 flex-col items-center'>
            <div className='flex w-full items-center'>
              <span className={`h-0.5 flex-1 ${i === 0 ? 'bg-transparent' : done ? 'bg-ink' : 'bg-line'}`} />
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${done ? 'border-ink bg-ink text-white' : 'border-line bg-white'}`}>
                {done ? <CheckIcon className='w-3 h-3' /> : <span className='h-1.5 w-1.5 rounded-full bg-line' />}
              </span>
              <span className={`h-0.5 flex-1 ${i === STATUS_STEPS.length - 1 ? 'bg-transparent' : currentIndex > i ? 'bg-ink' : 'bg-line'}`} />
            </div>
            <p className={`mt-1.5 text-center text-[10px] leading-tight sm:text-[11px] ${done ? 'font-medium text-ink' : 'text-ink-soft'}`}>{step.label}</p>
          </div>
        )
      })}
    </div>
  )
}

const Orders = () => {
  const { backendUrl, token, formatPrice, addToCart, navigate } = useContext(ShopContext)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Active')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
        if (response.data.success) {
          setOrders([...response.data.orders].sort((a, b) => b.date - a.date))
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const grouped = useMemo(() => ({
    Active: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled'),
    Completed: orders.filter(o => o.status === 'Delivered'),
    Cancelled: orders.filter(o => o.status === 'Cancelled'),
  }), [orders])

  const visible = grouped[activeTab] || []

  const buyAgain = (order) => {
    let added = 0
    for (const item of order.items) {
      if (item.color && item.size) {
        addToCart(item._id, item.color, item.size, Number(item.quantity) || 1)
        added++
      }
    }
    if (added > 0) navigate('/cart')
  }

  if (!token) {
    return (
      <AccountLayout>
        <div className='flex flex-col items-center gap-4 rounded-2xl border border-line bg-white px-6 py-20 text-center'>
          <BagIcon className='w-8 h-8 text-ink-soft' />
          <h1 className='font-display text-2xl font-medium text-ink'>My Orders</h1>
          <p className='text-sm text-ink-soft'>Log in to see your orders.</p>
          <Button as={Link} to='/login' arrow>Sign In</Button>
        </div>
      </AccountLayout>
    )
  }

  return (
    <AccountLayout>
      <div className='grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_240px]'>

        <div className='min-w-0'>
          <h1 className='font-display text-2xl font-semibold tracking-tight text-ink'>My Orders</h1>

          {/* Tabs */}
          <div className='mt-4 flex gap-5 border-b border-line text-sm'>
            {TABS.map(tab => (
              <button
                key={tab}
                type='button'
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer border-b-2 pb-2.5 font-medium transition-colors ${activeTab === tab ? 'border-ink text-ink' : 'border-transparent text-ink-soft hover:text-ink'}`}
              >
                {tab} ({grouped[tab].length})
              </button>
            ))}
          </div>

          {/* Orders */}
          <div className='mt-5 flex flex-col gap-4'>
            {loading && <p className='py-10 text-center text-sm text-ink-soft'>Loading your orders…</p>}

            {!loading && visible.length === 0 && (
              <div className='flex flex-col items-center gap-3 rounded-2xl border border-line bg-white px-6 py-14 text-center'>
                <BagIcon className='w-7 h-7 text-ink-soft' />
                <p className='text-sm text-ink-soft'>No {activeTab.toLowerCase()} orders.</p>
                <Button as={Link} to='/collection' size='sm' arrow>Shop the Collection</Button>
              </div>
            )}

            {visible.map(order => {
              const expanded = expandedId === order._id
              const itemCount = order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
              return (
                <div key={order._id} className='rounded-2xl border border-line bg-white p-5'>

                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div className='flex flex-wrap items-center gap-3'>
                      <p className='text-sm font-semibold text-ink'>Order {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}</p>
                      <span className='text-xs text-ink-soft'>{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeCls(order.status)}`}>
                        {order.status === 'Order Placed' ? 'Processing' : order.status}
                      </span>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-semibold text-ink'>{formatPrice(order.amount)}</p>
                      <p className='text-xs text-ink-soft'>{itemCount} item{itemCount === 1 ? '' : 's'}</p>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <OrderTimeline status={order.status} />
                  </div>

                  <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                      {order.items.slice(0, 4).map((item, i) => (
                        <Link key={i} to={`/product/${item._id}`} className='block h-14 w-12 overflow-hidden rounded-lg border border-line'>
                          <img src={item.image?.[0]} alt={item.name} className='h-full w-full object-cover' />
                        </Link>
                      ))}
                      {order.items.length > 4 && (
                        <span className='text-xs text-ink-soft'>+{order.items.length - 4} more</span>
                      )}
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {order.status === 'Delivered' ? (
                        <Button size='sm' onClick={() => buyAgain(order)}>Buy Again</Button>
                      ) : (
                        <Button size='sm' as={Link} to='/contact'>Track Order</Button>
                      )}
                      <Button size='sm' variant='outline' onClick={() => setExpandedId(expanded ? null : order._id)}>
                        {expanded ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>
                  </div>

                  {expanded && (
                    <div className='mt-4 flex flex-col gap-2.5 border-t border-line pt-4'>
                      {order.items.map((item, i) => (
                        <div key={i} className='flex items-center gap-3 text-sm'>
                          <div className='h-12 w-10 shrink-0 overflow-hidden rounded-lg'>
                            <img src={item.image?.[0]} alt={item.name} className='h-full w-full object-cover' />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <p className='truncate font-medium text-ink'>{item.name}</p>
                            <p className='text-xs text-ink-soft'>
                              {item.color ? `${item.color} / ` : ''}{item.size} × {item.quantity}
                            </p>
                          </div>
                          <p className='text-xs font-semibold text-ink'>{formatPrice((item.price || 0) * (item.quantity || 1))}</p>
                        </div>
                      ))}
                      <p className='mt-1 text-xs text-ink-soft'>Payment: {order.paymentMethod} · {order.payment ? 'Paid' : 'Pending'}</p>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        </div>

        {/* Need help rail */}
        <aside className='flex flex-col gap-4'>
          <div className='rounded-2xl border border-line bg-white p-5'>
            <p className='text-sm font-semibold text-ink'>Need Help?</p>
            <p className='mt-1 text-xs leading-relaxed text-ink-soft'>We're here to help you with your orders.</p>
            <Button as={Link} to='/contact' size='sm' className='mt-3 w-full'>Contact Support</Button>
            <div className='mt-4 flex flex-col gap-2 border-t border-line pt-3 text-xs'>
              {['Shipping & Delivery', 'Returns & Refunds', 'Payment Help'].map(label => (
                <Link key={label} to='/contact' className='text-ink-soft transition-colors hover:text-ink hover:underline'>{label}</Link>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </AccountLayout>
  )
}

export default Orders
