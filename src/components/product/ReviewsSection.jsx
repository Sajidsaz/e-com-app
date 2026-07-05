import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../../context/ShopContext'
import StarRating from '../ui/StarRating'
import Button from '../ui/Button'
import { ShieldIcon } from '../ui/Icons'

const timeAgo = (timestamp) => {
  const days = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000))
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  return new Date(timestamp).toLocaleDateString()
}

const StarPicker = ({ value, onChange }) => (
  <div className='flex items-center gap-1'>
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type='button'
        aria-label={`${star} star${star > 1 ? 's' : ''}`}
        onClick={() => onChange(star)}
        className={`cursor-pointer text-2xl leading-none transition-colors ${star <= value ? 'text-ink' : 'text-line hover:text-ink-soft'}`}
      >
        ★
      </button>
    ))}
  </div>
)

const ReviewForm = ({ productId, onSaved }) => {
  const { token, backendUrl } = useContext(ShopContext)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!token) {
    return (
      <p className='text-sm text-ink-soft'>
        <Link to='/login' className='font-medium text-ink underline underline-offset-4'>Log in</Link> to write a review.
      </p>
    )
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    setSubmitting(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/review/add',
        { productId, rating, comment },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Thanks for your review!')
        setRating(0)
        setComment('')
        onSaved?.()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Could not save your review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-3 rounded-2xl border border-line bg-white p-5'>
      <p className='text-sm font-medium text-ink'>Write a review</p>
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        minLength={3}
        maxLength={2000}
        rows={3}
        placeholder='Share your thoughts on fit, fabric, and quality…'
        className='w-full resize-y rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-ink'
      />
      <Button type='submit' disabled={submitting} className='self-start'>
        {submitting ? 'Saving…' : 'Submit Review'}
      </Button>
      <p className='text-[11px] text-ink-soft'>Reviewed this product before? Submitting again updates your review.</p>
    </form>
  )
}

/**
 * Review summary + list. The parent owns the data (so the header rating can
 * share it) and passes a refetch callback for after submits.
 */
const ReviewsSection = ({ productId, reviews, summary, onRefresh }) => {
  const distribution = summary?.distribution || {}
  const count = summary?.count || 0

  return (
    <section className='py-12' id='reviews'>
      <h2 className='font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>Customer Reviews</h2>

      <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]'>

        {/* Summary + form */}
        <div className='flex flex-col gap-6'>
          <div className='rounded-2xl border border-line bg-white p-5'>
            <p className='font-display text-4xl font-semibold text-ink'>
              {count ? summary.average.toFixed(1) : '—'}<span className='text-lg text-ink-soft'> / 5</span>
            </p>
            <StarRating rating={summary?.average || 0} className='mt-2' />
            <p className='mt-1 text-xs text-ink-soft'>Based on {count} review{count === 1 ? '' : 's'}</p>

            <div className='mt-4 flex flex-col gap-1.5'>
              {[5, 4, 3, 2, 1].map(stars => {
                const n = distribution[stars] || 0
                const pct = count ? (n / count) * 100 : 0
                return (
                  <div key={stars} className='flex items-center gap-2 text-xs text-ink-soft'>
                    <span className='w-12 shrink-0'>{stars} Star{stars > 1 ? 's' : ''}</span>
                    <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-cream-dark'>
                      <div className='h-full rounded-full bg-ink' style={{ width: `${pct}%` }} />
                    </div>
                    <span className='w-6 text-right'>{n}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <ReviewForm productId={productId} onSaved={onRefresh} />
        </div>

        {/* Review cards */}
        <div className='flex flex-col gap-4'>
          {reviews.length === 0 && (
            <p className='rounded-2xl border border-line bg-white p-6 text-sm text-ink-soft'>
              No reviews yet — be the first to share your experience.
            </p>
          )}
          {reviews.map(review => (
            <div key={review._id} className='rounded-2xl border border-line bg-white p-5'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div>
                  <p className='text-sm font-medium text-ink'>{review.name}</p>
                  {review.verifiedBuyer && (
                    <p className='flex items-center gap-1 text-[11px] text-ink-soft'>
                      <ShieldIcon className='w-3 h-3' /> Verified Buyer
                    </p>
                  )}
                </div>
                <span className='text-xs text-ink-soft'>{timeAgo(review.date)}</span>
              </div>
              <StarRating rating={review.rating} className='mt-2' />
              <p className='mt-3 text-sm leading-relaxed text-ink-soft'>{review.comment}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ReviewsSection
