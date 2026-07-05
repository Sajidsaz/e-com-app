import React, { useContext, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { ShopContext } from '../../context/ShopContext'
import Button from '../ui/Button'
import { CheckIcon } from '../ui/Icons'

const inputCls = 'w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-ink'

const DEFAULT_TIMELINE = [
  { label: 'Placed', done: false, hint: "We've received your order." },
  { label: 'Confirmed', done: false, hint: 'Your order has been confirmed.' },
  { label: 'Shipped', done: false, hint: 'Your order is on its way.' },
  { label: 'Out for Delivery', done: false, hint: 'Your order is out for delivery.' },
  { label: 'Delivered', done: false, hint: 'Your order has been delivered.' },
]

const TrackOrderWidget = () => {
  const { backendUrl, formatPrice } = useContext(ShopContext)
  const [orderNumber, setOrderNumber] = useState('')
  const [contact, setContact] = useState('')
  const [tracking, setTracking] = useState(false)
  const [result, setResult] = useState(null)

  const timeline = result
    ? result.timeline.map((step, i) => ({ ...step, hint: DEFAULT_TIMELINE[i]?.hint }))
    : DEFAULT_TIMELINE

  const onSubmit = async (event) => {
    event.preventDefault()
    setTracking(true)
    try {
      const response = await axios.post(backendUrl + '/api/order/track', { orderNumber, contact })
      if (response.data.success) {
        setResult(response.data.order)
      }
    } catch (error) {
      console.log(error)
      setResult(null)
      toast.error(error?.response?.data?.message || 'No order found matching those details')
    } finally {
      setTracking(false)
    }
  }

  return (
    <div className='rounded-2xl border border-line bg-white p-6 sm:p-8'>
      <h2 className='font-display text-xl font-medium tracking-tight text-ink sm:text-2xl'>Track Your Order</h2>
      <p className='mt-1 text-sm text-ink-soft'>
        Enter your details below to get real-time updates on your order status.
      </p>

      <form onSubmit={onSubmit} className='mt-6 flex flex-col gap-4'>
        <input required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder='Order Number (e.g. HS-123456)' className={inputCls} />
        <input required value={contact} onChange={(e) => setContact(e.target.value)} placeholder='Email or Phone Number' className={inputCls} />
        <Button type='submit' size='lg' arrow disabled={tracking} className='w-full'>
          {tracking ? 'Tracking…' : 'Track Order'}
        </Button>
      </form>

      {result && (
        <div className='mt-5 rounded-xl bg-cream p-4 text-sm'>
          <p className='font-medium text-ink'>Order {result.orderNumber}</p>
          <p className='text-xs text-ink-soft'>
            {result.itemCount} item{result.itemCount === 1 ? '' : 's'} · {formatPrice(result.amount)} · placed {new Date(result.date).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Status timeline */}
      <div className='mt-6 flex flex-col'>
        {timeline.map((step, i) => {
          const isCurrent = result && step.done && !(timeline[i + 1]?.done)
          return (
            <div key={step.label} className='flex gap-4'>
              <div className='flex flex-col items-center'>
                {/* Keyed by lookup so each new result replays the fill-in */}
                <motion.span
                  key={result ? `${result.orderNumber}-${step.done}` : 'idle'}
                  initial={step.done ? { scale: 0.4, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: i * 0.12 }}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${step.done ? 'border-ink bg-ink text-white' : 'border-line bg-white'}`}
                >
                  {step.done ? <CheckIcon className='w-3 h-3' /> : <span className='h-1.5 w-1.5 rounded-full bg-line' />}
                </motion.span>
                {i < timeline.length - 1 && (
                  <span className={`w-0.5 flex-1 ${step.done && timeline[i + 1]?.done ? 'bg-ink' : 'bg-line'}`} style={{ minHeight: 20 }} />
                )}
              </div>
              <div className='pb-5'>
                <p className={`text-sm ${isCurrent ? 'font-semibold text-ink' : step.done ? 'font-medium text-ink' : 'text-ink-soft'}`}>{step.label}</p>
                <p className='text-xs text-ink-soft'>{step.hint}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TrackOrderWidget
