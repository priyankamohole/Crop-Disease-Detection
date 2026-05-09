import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const UploadComponent = (props) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      navigate('/detect', { state: { imageFile: file, imagePreview: previewUrl } });
    }
    e.target.value = null;
  };

  return (
    <>
      <div 
        className='flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity'
        onClick={handleUploadClick}
      >
          <div className='w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mb-2 sm:mb-4 text-xl sm:text-2xl font-bold text-green-500'>
              <props.icon className='w-5 h-5 sm:w-8 sm:h-8' />
          </div>
          <h3 className='font-semibold text-sm sm:text-base md:text-lg text-white'>{props.title}</h3>
          <p className='text-gray-300 tracking-wide text-xs sm:text-sm'>{props.desc}</p>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />
    </>
  )
}

export default UploadComponent;