import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../../context/ShopContext'
import Button from '../ui/Button'
import { contactContent } from '../../data/contactContent'

const inputCls = 'w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-ink'

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' }

const ContactForm = ({ prefillSubject, onSubjectConsumed }) => {
  const { backendUrl } = useContext(ShopContext)
  const [form, setForm] = useState(EMPTY)
  const [sending, setSending] = useState(false)

  // Quick Help cards can pre-select a subject
  React.useEffect(() => {
    if (prefillSubject) {
      setForm(prev => ({ ...prev, subject: prefillSubject }))
      onSubjectConsumed?.()
    }
  }, [prefillSubject])

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const onSubmit = async (event) => {
    event.preventDefault()
    setSending(true)
    try {
      const response = await axios.post(backendUrl + '/api/contact/send', form)
      if (response.data.success) {
        toast.success(response.data.message)
        setForm(EMPTY)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Could not send your message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className='rounded-2xl border border-line bg-white p-6 sm:p-8'>
      <h2 className='font-display text-xl font-medium tracking-tight text-ink sm:text-2xl'>Send Us a Message</h2>
      <p className='mt-1 text-sm text-ink-soft'>
        Have a question or need help? Fill out the form below and our team will get back to you.
      </p>

      <form onSubmit={onSubmit} className='mt-6 flex flex-col gap-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <input required minLength={2} maxLength={100} value={form.name} onChange={set('name')} placeholder='Full Name' className={inputCls} />
          <input required type='email' value={form.email} onChange={set('email')} placeholder='Email Address' className={inputCls} />
        </div>
        <input value={form.phone} onChange={set('phone')} maxLength={30} placeholder='Phone Number (optional)' className={inputCls} />
        <select required value={form.subject} onChange={set('subject')} className={`${inputCls} cursor-pointer ${form.subject ? '' : 'text-ink-soft'}`}>
          <option value='' disabled>Subject</option>
          {contactContent.subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
        <textarea required minLength={10} maxLength={5000} rows={5} value={form.message} onChange={set('message')} placeholder='Message' className={`${inputCls} resize-y`} />
        <Button type='submit' size='lg' arrow disabled={sending} className='self-start'>
          {sending ? 'Sending…' : 'Send Message'}
        </Button>
      </form>
    </div>
  )
}

export default ContactForm
