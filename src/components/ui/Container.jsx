import React from 'react'

/**
 * Standard content container. Sections own their full-bleed backgrounds and
 * put their content inside a Container (replaces the old global padding
 * wrapper in App.jsx).
 */
const Container = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-[1400px] px-4 sm:px-8 ${className}`}>{children}</div>
)

export default Container
