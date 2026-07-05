import React from 'react'
import { useParams, Link } from 'react-router-dom'
import AccountLayout from '../components/account/AccountLayout'
import Button from '../components/ui/Button'
import { ClockIcon } from '../components/ui/Icons'

const SECTION_TITLES = {
  'addresses': 'Addresses',
  'payment-methods': 'Payment Methods',
  'size-preferences': 'Size Preferences',
  'notifications': 'Notifications',
}

// Placeholder for account sections whose backend doesn't exist yet.
const AccountSection = () => {
  const { section } = useParams()
  const title = SECTION_TITLES[section] || 'Account'

  return (
    <AccountLayout>
      <div className='flex flex-col items-center gap-4 rounded-2xl border border-line bg-white px-6 py-20 text-center'>
        <ClockIcon className='w-8 h-8 text-ink-soft' />
        <h1 className='font-display text-2xl font-medium text-ink'>{title}</h1>
        <p className='max-w-sm text-sm text-ink-soft'>
          This section is coming soon. We're working on it — in the meantime our team can help with anything you need.
        </p>
        <Button as={Link} to='/contact' arrow>Contact Support</Button>
      </div>
    </AccountLayout>
  )
}

export default AccountSection
