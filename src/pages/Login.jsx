import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import ArchImage from '../components/ui/ArchImage'
import Badge from '../components/ui/Badge'
import { EyeIcon, TruckIcon, HeartIcon, ClockIcon, StarOutlineIcon } from '../components/ui/Icons'
import { assets } from '../assets/assets'

const inputCls = 'w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-ink'

const benefits = [
  { icon: TruckIcon, title: 'Track Orders', text: 'Stay updated on your orders in real time.' },
  { icon: HeartIcon, title: 'Wishlist', text: 'Save your favorite pieces for later.' },
  { icon: ClockIcon, title: 'Faster Checkout', text: 'Secure details for a quicker checkout.' },
  { icon: StarOutlineIcon, title: 'Exclusive Access', text: 'Be the first to know about new arrivals.' },
]

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isLogin = currentState === 'Login'

  const onSubmithandler = async (event) => {
    event.preventDefault();
    setSubmitting(true)
    try {
      if (!isLogin) {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSubmitting(false)
    }
  }

  // If the user is already logged in, bounce them to home
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <Container className='py-12'>
      <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.1fr_0.8fr]'>

        {/* Editorial image */}
        <ArchImage src={assets.store} alt='HeySaz editorial look' className='mx-auto hidden aspect-[3/4] w-full max-w-sm lg:block' />

        {/* Form card */}
        <form onSubmit={onSubmithandler} className='mx-auto w-full max-w-md rounded-2xl border border-line bg-white p-6 sm:p-8'>
          <h1 className='font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl'>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className='mt-1 text-sm text-ink-soft'>
            {isLogin ? 'Sign in to continue to HeySaz Fashion.' : 'Join HeySaz Fashion in a few seconds.'}
          </p>

          <div className='mt-6 flex flex-col gap-4'>
            {!isLogin && (
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type='text'
                className={inputCls}
                placeholder='Full Name'
                required
              />
            )}
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
              className={inputCls}
              placeholder='you@email.com'
              required
            />
            <div className='relative'>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? 'text' : 'password'}
                className={`${inputCls} pr-11`}
                placeholder='Password'
                required
              />
              <button
                type='button'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(s => !s)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-ink-soft hover:text-ink'
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>

            {isLogin && (
              <p
                onClick={() => navigate('/forgot-password')}
                className='-mt-1 cursor-pointer self-end text-xs text-ink-soft underline underline-offset-4 hover:text-ink'
              >
                Forgot password?
              </p>
            )}

            <Button type='submit' size='lg' disabled={submitting} className='w-full'>
              {submitting ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            {/* Social sign-in — awaiting OAuth setup */}
            <div className='flex items-center gap-3 text-[11px] text-ink-soft'>
              <span className='h-px flex-1 bg-line' /> or continue with <span className='h-px flex-1 bg-line' />
            </div>
            <div className='relative flex flex-col gap-2'>
              <Badge variant='neutral' className='absolute -top-2 right-0 z-10'>Coming Soon</Badge>
              <button type='button' disabled className='w-full cursor-not-allowed rounded-full border border-line bg-white px-6 py-2.5 text-sm font-medium text-ink opacity-50'>
                Continue with Google
              </button>
              <button type='button' disabled className='w-full cursor-not-allowed rounded-full border border-line bg-white px-6 py-2.5 text-sm font-medium text-ink opacity-50'>
                Continue with Apple
              </button>
            </div>

            <p className='text-center text-sm text-ink-soft'>
              {isLogin ? 'New to HeySaz?' : 'Already have an account?'}{' '}
              <span
                onClick={() => setCurrentState(isLogin ? 'Sign Up' : 'Login')}
                className='cursor-pointer font-medium text-ink underline underline-offset-4'
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </span>
            </p>
          </div>
        </form>

        {/* Benefits rail */}
        <div className='mx-auto flex w-full max-w-md flex-col gap-3 lg:max-w-none'>
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className='flex items-center gap-3 rounded-2xl border border-line bg-white p-4'>
              <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line'>
                <Icon className='w-4 h-4 text-ink' />
              </span>
              <div>
                <p className='text-sm font-medium text-ink'>{title}</p>
                <p className='text-xs text-ink-soft'>{text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Container>
  )
}

export default Login
