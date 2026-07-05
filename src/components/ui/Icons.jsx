import React from 'react'

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const SearchIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <circle cx='11' cy='11' r='7' />
    <line x1='21' y1='21' x2='16.5' y2='16.5' />
  </svg>
)

export const UserIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <circle cx='12' cy='8' r='4' />
    <path d='M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5' />
  </svg>
)

export const HeartIcon = ({ className = 'w-5 h-5', filled = false }) => (
  <svg className={className} viewBox='0 0 24 24' {...base} fill={filled ? 'currentColor' : 'none'}>
    <path d='M12 20.5s-7.5-4.7-9.5-9.2C1.2 8.3 3 5 6.4 5c2 0 3.6 1.1 4.6 2.7h2C14 6.1 15.6 5 17.6 5 21 5 22.8 8.3 21.5 11.3c-2 4.5-9.5 9.2-9.5 9.2z' />
  </svg>
)

export const BagIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <path d='M5 8h14l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8z' />
    <path d='M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10' />
  </svg>
)

export const MenuIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <line x1='4' y1='7' x2='20' y2='7' />
    <line x1='4' y1='12' x2='20' y2='12' />
    <line x1='4' y1='17' x2='20' y2='17' />
  </svg>
)

export const CloseIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <line x1='6' y1='6' x2='18' y2='18' />
    <line x1='18' y1='6' x2='6' y2='18' />
  </svg>
)

export const TruckIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <path d='M2 7h12v9H2z' />
    <path d='M14 10h4l3 3v3h-7' />
    <circle cx='6' cy='18.5' r='1.8' />
    <circle cx='17.5' cy='18.5' r='1.8' />
  </svg>
)

export const ReturnIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <path d='M4 9a8.5 8.5 0 1 1-1 6' />
    <polyline points='4 4 4 9 9 9' />
  </svg>
)

export const ShieldIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <path d='M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z' />
    <polyline points='9 12 11.2 14.2 15 10' />
  </svg>
)

export const CheckIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <polyline points='4.5 12.5 9.5 17.5 19.5 7' />
  </svg>
)

export const GlobeIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <circle cx='12' cy='12' r='9' />
    <path d='M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z' />
  </svg>
)

export const StarOutlineIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <path d='M12 3l2.8 5.8 6.2.9-4.5 4.3 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.7l6.2-.9L12 3z' />
  </svg>
)

export const PhoneIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <path d='M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z' />
  </svg>
)

export const MailIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <rect x='3' y='5' width='18' height='14' rx='2' />
    <polyline points='3 7 12 13.5 21 7' />
  </svg>
)

export const PinIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <path d='M12 21s-6.5-5.4-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21z' />
    <circle cx='12' cy='10.5' r='2.5' />
  </svg>
)

export const ClockIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <circle cx='12' cy='12' r='9' />
    <polyline points='12 6.5 12 12 15.5 14' />
  </svg>
)

export const ChevronDownIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <polyline points='6 9 12 15 18 9' />
  </svg>
)

export const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <polyline points='4 7 20 7' />
    <path d='M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2' />
    <path d='M6.5 7l1 13a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-13' />
    <line x1='10' y1='11' x2='10' y2='17' />
    <line x1='14' y1='11' x2='14' y2='17' />
  </svg>
)

export const TagIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <path d='M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9z' />
    <circle cx='8' cy='8' r='1.5' />
  </svg>
)

export const EyeIcon = ({ className = 'w-4 h-4', off = false }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <path d='M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z' />
    <circle cx='12' cy='12' r='2.8' />
    {off && <line x1='4' y1='20' x2='20' y2='4' />}
  </svg>
)

export const ZoomIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox='0 0 24 24' {...base}>
    <circle cx='11' cy='11' r='7' />
    <line x1='21' y1='21' x2='16.5' y2='16.5' />
    <line x1='8' y1='11' x2='14' y2='11' />
    <line x1='11' y1='8' x2='11' y2='14' />
  </svg>
)
