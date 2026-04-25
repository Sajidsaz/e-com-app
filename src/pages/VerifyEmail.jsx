import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

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

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>
          {status === 'verifying' && 'Verifying...'}
          {status === 'success' && 'Verified ✓'}
          {status === 'error' && 'Verification Failed'}
        </p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {status === 'verifying' && (
        <p className='text-sm text-center'>Please wait while we verify your email...</p>
      )}

      {status === 'success' && (
        <>
          <p className='text-sm text-center'>{message}</p>
          <p className='text-sm text-center text-gray-600'>You can now place orders on HeySaz.</p>
          <button
            onClick={() => navigate('/')}
            className='cursor-pointer bg-black text-white font-light px-8 py-2 mt-4'
          >
            Continue Shopping
          </button>
        </>
      )}

      {status === 'error' && (
        <>
          <p className='text-sm text-center'>{message}</p>
          <button
            onClick={() => navigate('/login')}
            className='cursor-pointer bg-black text-white font-light px-8 py-2 mt-4'
          >
            Back to Login
          </button>
        </>
      )}
    </div>
  )
}

export default VerifyEmail