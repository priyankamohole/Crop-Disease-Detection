import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Arrow = () => {

  const navigate=useNavigate();

  return (
    <div>
        <button 
        onClick={()=>{navigate("/")}}  
        className='mr-2 p-1 rounded-full hover:bg-white/20 transition-colors' >
          <ArrowLeft size={24}/>
        </button>
    </div>
  )
}

export default Arrow