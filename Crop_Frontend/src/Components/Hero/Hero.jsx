import React from 'react'
import Section1 from '../Section1/Section1'
import Section2 from '../Section2/Section2'

const Hero = () => {
  return (
    <div className='flex flex-col min-h-screen'>
        <Section1/>
        <Section2/>
    </div>
  )
}

export default Hero