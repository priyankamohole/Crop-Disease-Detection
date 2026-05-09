import React, { useState } from 'react'
import Detection from './Detection/Detection'
import Result from './Result/Result'
import bgImg from '../../../images/bg-img1.jpg'
import Bar from '../Bar/Bar'


const MainScreen = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Bar/>
      <div className='flex flex-col min-h-screen relative bg-gradient-to-br from-green-100 via-white to-green-50 overflow-hidden'>
        <div className="absolute inset-0 opacity-60 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bgImg})` }} />
        <div className='relative z-10 flex-1 flex flex-col items-center justify-center p-3 py-6 sm:p-6 sm:py-10 w-full'>
          <div className='grid gap-6 sm:gap-8 w-full max-w-6xl grid-cols-1 md:grid-cols-2'>
            <Detection setResult={setResult} setLoading={setLoading} />
            <Result result={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  
        
  )
}

export default MainScreen;