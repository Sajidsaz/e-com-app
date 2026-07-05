import React from 'react'
import Container from './ui/Container'

// Shared centered card for the small auth flows (forgot/reset/verify).
export const authInputCls = 'w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-ink'

const AuthCard = ({ title, subtitle, children }) => (
  <Container className='py-16'>
    <div className='mx-auto w-full max-w-md rounded-2xl border border-line bg-white p-6 text-center sm:p-8'>
      <h1 className='font-display text-2xl font-semibold tracking-tight text-ink'>{title}</h1>
      {subtitle && <p className='mt-2 text-sm leading-relaxed text-ink-soft'>{subtitle}</p>}
      <div className='mt-6 flex flex-col items-center gap-4'>{children}</div>
    </div>
  </Container>
)

export default AuthCard
