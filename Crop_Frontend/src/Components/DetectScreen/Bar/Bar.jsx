import React from 'react'
import Arrow from '../Arrow/Arrow'


const Bar = () => {
  return (
    <div className=' bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden'>
      <div className='relative p-3 sm:p-4 bg-green-800 text-white flex items-center shadow-md'>
        <Arrow/>
        <span className='font-raleway tracking-wide font-bold text-base sm:text-lg'>Plant Disease Detection</span>
      </div>
    </div>
  )
}

export default Bar