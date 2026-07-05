import React from 'react'

/**
 * Image inside the signature arched mask (full-radius top, square bottom).
 * `arch` = false renders a soft-rounded rectangle instead (used for the
 * flanking images in hero collages).
 */
const ArchImage = ({ src, alt = '', arch = true, className = '', imgClassName = '' }) => (
  <div className={`overflow-hidden ${arch ? 'rounded-t-full' : 'rounded-2xl'} ${className}`}>
    {/* object-top: portrait photos crop from the bottom, keeping faces in frame */}
    <img src={src} alt={alt} className={`h-full w-full object-cover object-top ${imgClassName}`} />
  </div>
)

export default ArchImage
