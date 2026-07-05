import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import AuthCard, { authInputCls } from '../components/AuthCard'
import Button from '../components/ui/Button'

const ResetPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // If someone lands on /reset-password with no token, send them away
  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link')
      navigate('/login')
    }
  }, [token])

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/user/reset-password', {
        token,
        password
      })
      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/login')
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

  // Don't render the form while the redirect-on-no-token effect is running
  if (!token) return null

  return (
    <AuthCard title='Reset Password' subtitle='Enter your new password below.'>
      <form onSubmit={onSubmitHandler} className='flex w-full flex-col items-center gap-4'>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type='password'
          className={authInputCls}
          placeholder='New password (8+ characters)'
          required
        />
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type='password'
          className={authInputCls}
          placeholder='Confirm new password'
          required
        />
        <Button type='submit' disabled={loading} className='w-full'>
          {loading ? 'Resetting…' : 'Reset Password'}
        </Button>
      </form>
    </AuthCard>
  )
}

export default ResetPassword
