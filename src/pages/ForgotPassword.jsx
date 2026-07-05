import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import AuthCard, { authInputCls } from '../components/AuthCard'
import Button from '../components/ui/Button'

const ForgotPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext)

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/user/forgot-password', { email })
      if (response.data.success) {
        // Always show the same confirmation, even if the email doesn't exist —
        // matches the backend's anti-enumeration response.
        setSubmitted(true)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <AuthCard
        title='Check Your Email'
        subtitle={<>If an account exists for <span className='font-medium text-ink'>{email}</span>, we've sent a password reset link. Check your inbox (and spam folder) — the link expires in 1 hour.</>}
      >
        <Button onClick={() => navigate('/login')}>Back to Login</Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title='Forgot Password'
      subtitle="Enter your email and we'll send you a link to reset your password."
    >
      <form onSubmit={onSubmitHandler} className='flex w-full flex-col items-center gap-4'>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type='email'
          className={authInputCls}
          placeholder='Email'
          required
        />
        <Button type='submit' disabled={loading} className='w-full'>
          {loading ? 'Sending…' : 'Send Reset Link'}
        </Button>
        <p
          onClick={() => navigate('/login')}
          className='cursor-pointer text-xs text-ink-soft underline underline-offset-4 hover:text-ink'
        >
          Back to Login
        </p>
      </form>
    </AuthCard>
  )
}

export default ForgotPassword
