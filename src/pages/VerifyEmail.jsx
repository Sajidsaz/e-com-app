import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import AuthCard from '../components/AuthCard'
import Button from '../components/ui/Button'

const VerifyEmail = () => {
  const { backendUrl, navigate } = useContext(ShopContext)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  // 'verifying' | 'success' | 'error' — drives what we render
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

  // React Strict Mode mounts components twice in dev, which would fire the
  // verify call twice and cause the second attempt to fail (single-use token).
  // This ref guards against that — production builds don't strict-mount but
  // it's harmless to keep.
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    if (!token) {
      setStatus('error')
      setMessage('No verification token provided.')
      return
    }

    const verify = async () => {
      try {
        const response = await axios.post(backendUrl + '/api/user/verify-email', { token })
        if (response.data.success) {
          setStatus('success')
          setMessage(response.data.message)
        } else {
          setStatus('error')
          setMessage(response.data.message)
        }
      } catch (error) {
        console.log(error)
        setStatus('error')
        setMessage(error?.response?.data?.message || 'Something went wrong')
      }
    }

    verify()
  }, [token])

  const title =
    status === 'verifying' ? 'Verifying…'
    : status === 'success' ? 'Verified ✓'
    : 'Verification Failed'

  return (
    <AuthCard title={title} subtitle={status === 'verifying' ? 'Please wait while we verify your email…' : message}>
      {status === 'success' && (
        <>
          <p className='text-sm text-ink-soft'>You can now place orders on HeySaz.</p>
          <Button onClick={() => navigate('/')} arrow>Continue Shopping</Button>
        </>
      )}
      {status === 'error' && (
        <Button onClick={() => navigate('/login')}>Back to Login</Button>
      )}
    </AuthCard>
  )
}

export default VerifyEmail
