import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import ArchImage from '../components/ui/ArchImage'
import Accordion from '../components/ui/Accordion'
import Reveal from '../components/ui/Reveal'
import TrustStrip from '../components/TrustStrip'
import SizeGuideModal from '../components/SizeGuideModal'
import ContactForm from '../components/contact/ContactForm'
import TrackOrderWidget from '../components/contact/TrackOrderWidget'
import { PhoneIcon, MailIcon, PinIcon, ClockIcon } from '../components/ui/Icons'
import { assets } from '../assets/assets'
import { contactContent, quickHelpTopics, faqs } from '../data/contactContent'

const Contact = () => {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [prefillSubject, setPrefillSubject] = useState('')
  const faqRef = useRef(null)

  const infoCards = [
    {
      icon: PhoneIcon,
      title: 'WhatsApp Support',
      text: 'Chat with our team instantly for quick assistance.',
      detail: contactContent.phoneDisplay,
      href: contactContent.whatsapp,
    },
    {
      icon: MailIcon,
      title: 'Email Support',
      text: "Send us an email and we'll get back to you.",
      detail: contactContent.email,
      href: `mailto:${contactContent.email}`,
    },
    {
      icon: PinIcon,
      title: 'Store Location',
      text: 'Visit our store in Kaduruwela, Polonnaruwa.',
      detail: contactContent.address.lines.join(', '),
      href: contactContent.mapsLink,
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      text: "We're here to help you during our business hours.",
      detail: contactContent.hours,
    },
  ]

  const handleQuickHelp = (action, title) => {
    if (action === 'size-guide') {
      setSizeGuideOpen(true)
    } else if (title === 'FAQ' || action === 'faq') {
      faqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div>

      {/* Hero */}
      <section className='w-full bg-cream'>
        <Container className='grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-2 lg:py-16'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className='flex flex-col items-start gap-5'
          >
            <p className='text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft'>Contact Us</p>
            <h1 className='font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl'>How Can We Help?</h1>
            <p className='max-w-md text-base text-ink-soft'>
              Our team is here to help with sizing, orders, delivery, returns, and product questions.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className='grid grid-cols-3 items-end gap-4'
          >
            <ArchImage src={assets.about1} alt='HeySaz support' className='aspect-[3/4] w-full' />
            <ArchImage src={assets.store4} alt='Casual shirt' className='aspect-[3/5] w-full' />
            <div className='overflow-hidden rounded-2xl'>
              <img src={assets.hero1} alt='Fabric detail' loading='lazy' className='aspect-[3/5] w-full object-cover' />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Info cards */}
      <Reveal>
        <Container className='py-10'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {infoCards.map(({ icon: Icon, title, text, detail, href }) => (
              <div key={title} className='flex flex-col items-center gap-2.5 rounded-2xl border border-line bg-white px-6 py-8 text-center'>
                <span className='flex h-11 w-11 items-center justify-center rounded-full border border-line'>
                  <Icon className='w-5 h-5 text-ink' />
                </span>
                <p className='text-sm font-medium text-ink'>{title}</p>
                <p className='text-xs leading-relaxed text-ink-soft'>{text}</p>
                {href ? (
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel='noreferrer' className='text-xs font-medium text-ink underline underline-offset-4 hover:opacity-70'>
                    {detail}
                  </a>
                ) : (
                  <p className='text-xs font-medium text-ink'>{detail}</p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Reveal>

      {/* Form + tracker */}
      <Container className='py-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <ContactForm prefillSubject={prefillSubject} onSubjectConsumed={() => setPrefillSubject('')} />
          <TrackOrderWidget />
        </div>
      </Container>

      {/* Quick help */}
      <Reveal>
        <Container className='py-12'>
          <div className='text-center'>
            <p className='text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft'>How can we help?</p>
            <h2 className='mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>Quick Help Topics</h2>
          </div>
          <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
            {quickHelpTopics.map(({ title, text, action }) => (
              <button
                key={title}
                type='button'
                onClick={() => handleQuickHelp(action, title)}
                className='flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-line bg-white px-4 py-6 text-center transition-shadow hover:shadow-md'
              >
                <p className='text-sm font-medium text-ink'>{title}</p>
                <p className='text-[11px] leading-relaxed text-ink-soft'>{text}</p>
              </button>
            ))}
          </div>
        </Container>
      </Reveal>

      <Reveal><TrustStrip /></Reveal>

      {/* FAQ */}
      <Container className='py-12'>
        <div ref={faqRef} className='grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]'>
          <div>
            <p className='text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft'>Frequently Asked Questions</p>
            <h2 className='mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>FAQs</h2>
          </div>
          <Accordion items={faqs.map(({ question, answer }) => ({ title: question, content: answer }))} defaultOpen={null} />
        </div>
      </Container>

      {/* Map + store card */}
      <Reveal>
        <Container className='py-6'>
          <div className='relative overflow-hidden rounded-2xl border border-line'>
            <iframe
              src={contactContent.mapEmbed}
              title='HeySaz store location'
              loading='lazy'
              className='h-[380px] w-full border-0'
              referrerPolicy='no-referrer-when-downgrade'
              allowFullScreen
            />
            <div className='bottom-6 right-6 m-4 rounded-2xl border border-line bg-white p-5 shadow-md sm:absolute sm:m-0 sm:w-72'>
              <p className='text-sm font-medium text-ink'>Visit Our Store</p>
              <p className='mt-2 text-xs leading-relaxed text-ink-soft'>
                {contactContent.address.lines.map((line, i) => <span key={i}>{line}<br /></span>)}
              </p>
              <Button as='a' href={contactContent.mapsLink} target='_blank' rel='noreferrer' size='sm' arrow className='mt-3'>
                Get Directions
              </Button>
            </div>
          </div>
        </Container>
      </Reveal>

      {/* Size guide CTA */}
      <Reveal>
        <Container className='py-10'>
          <div className='grid grid-cols-1 items-center gap-6 rounded-2xl bg-cream-dark p-6 sm:p-10 lg:grid-cols-[1fr_2fr]'>
            <ArchImage src={assets.model2} alt='Find your size' className='mx-auto aspect-square w-40 sm:w-48' />
            <div className='flex flex-col items-center gap-3 text-center lg:items-start lg:text-left'>
              <h2 className='font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>Need help choosing your size?</h2>
              <p className='text-sm text-ink-soft'>Our size guide makes it easy to find your perfect fit.</p>
              <div className='flex flex-wrap justify-center gap-3'>
                <Button type='button' onClick={() => setSizeGuideOpen(true)} arrow>Open Size Guide</Button>
                <Button as={Link} to='/collection' variant='outline'>Shop Collection</Button>
              </div>
            </div>
          </div>
        </Container>
      </Reveal>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

    </div>
  )
}

export default Contact
