import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Container from './ui/Container'
import Button from './ui/Button'
import { MailIcon, ShieldIcon } from './ui/Icons'

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    // No mailing-list backend yet — mirrors the old NewsletterBox behavior.
    toast.success('Thanks for subscribing!')
    setEmail('')
  }

  return (
    <section className='py-12'>
      <Container>
        <div className='flex flex-col items-center gap-4 rounded-2xl bg-cream-dark px-6 py-12 text-center'>
          <MailIcon className='w-6 h-6 text-ink' />
          <h2 className='font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>Join the HeySaz Circle</h2>
          <p className='max-w-md text-sm text-ink-soft'>
            Be the first to know about new arrivals, exclusive offers, and style inspiration.
          </p>
          <form onSubmit={onSubmit} className='mt-2 flex w-full max-w-md items-center gap-2'>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email address'
              className='w-full flex-1 rounded-full border border-line bg-white px-5 py-2.5 text-sm outline-none focus:border-ink'
            />
            <Button type='submit' arrow>Subscribe</Button>
          </form>
          <p className='flex items-center gap-1.5 text-xs text-ink-soft'>
            <ShieldIcon className='w-3.5 h-3.5' />
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </Container>
    </section>
  )
}

export default Newsletter
