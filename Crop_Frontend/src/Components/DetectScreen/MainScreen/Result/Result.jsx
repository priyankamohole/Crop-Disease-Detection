import React from 'react'
import { ShieldCheck, BarChart2, LightbulbIcon, Leaf, Loader2 } from 'lucide-react'

const Result = ({ result, loading }) => {
  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 w-full border border-white/30">
        <h2 className="text-xl sm:text-2xl font-raleway font-bold text-center bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-4 sm:mb-6">
          Analysis Result
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 size={40} className="animate-spin text-green-500" />
            <p className="text-gray-500 font-merriweather text-sm">Analyzing your leaf image...</p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div className="flex items-center p-3 sm:p-4 bg-green-50 rounded-xl">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg mr-4">
                <ShieldCheck size={22} className="text-green-400" />
              </div>
              <div>
                <p className="font-raleway text-sm text-gray-500">Disease Identified</p>
                <p className="font-merriweather text-lg font-semibold text-green-800">{result.display_name}</p>
              </div>
            </div>
            <div className="flex items-center p-3 sm:p-4 bg-blue-50 rounded-xl">
              <div className='flex-shrink-0 p-3 bg-blue-100 rounded-lg mr-4'>
                <BarChart2 size={22} className="text-blue-400" />
              </div>
              <div>
                <p className="font-raleway text-sm text-gray-500">Confidence Score</p>
                <p className="font-merriweather text-lg font-semibold text-blue-800">
                  {result.confidence}%
                </p>
              </div>
            </div>
            <div className='p-3 sm:p-4 bg-amber-50 rounded-xl'>
              <div className='flex items-start mb-2'>
                <div className='flex-shrink-0 p-3 bg-amber-100 rounded-lg mr-4'>
                  <LightbulbIcon size={22} className='text-amber-400' />
                </div>
                <div>
                  <p className="font-raleway text-sm text-gray-600">Expert Advice</p>
                  <p className="font-merriweather text-normal tracking-wide font-semibold text-amber-800">
                    {result.advice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
            <Leaf size={40} />
            <p className="font-merriweather text-sm text-center">
              Upload a leaf image and click <strong>"Detect Disease"</strong> to see results here.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default Result;