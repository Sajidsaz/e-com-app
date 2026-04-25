import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

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
      <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>Check Your Email</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        <p className='text-sm text-center'>
          If an account exists for <span className='font-medium'>{email}</span>, we've sent a
          password reset link. Check your inbox (and spam folder) — the link expires in 1 hour.
        </p>
        <button
          onClick={() => navigate('/login')}
          className='cursor-pointer bg-black text-white font-light px-8 py-2 mt-4'
        >
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
    >
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Forgot Password</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      <p className='text-sm text-center'>
        Enter your email and we'll send you a link to reset your password.
      </p>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type='email'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Email'
        required
      />
      <button
        type='submit'
        disabled={loading}
        className='cursor-pointer bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-60'
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
      <p
        onClick={() => navigate('/login')}
        className='cursor-pointer text-sm'
      >
        Back to Login
      </p>
    </form>
  )
}

export default ForgotPassword