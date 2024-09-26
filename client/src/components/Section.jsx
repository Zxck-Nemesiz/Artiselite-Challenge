import React from 'react'

const Section = ({
    className,
    id,
    customPaddings,
    children
}) => {
  return (
    <div id={id} className={`
      relative 
      h-screen
      ${
        customPaddings ||
        `py-10 lg:py-16 xl:py-20`
      } 
      ${className || ""}`}>
    {children}
    <div className='hidden absolute top-0 left-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:left-6 xl:left-8'/>
    <div className='hidden absolute top-0 right-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:right-6 xl:right-8'/>
    </div>
  )
}

export default Section