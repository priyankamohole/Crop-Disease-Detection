import React from 'react'
import {Camera, Upload, Bot, Download} from 'lucide-react'
import CameraComponent from './Camera/CameraComponent'
import UploadComponent from './Upload/UploadComponent'
import ChatbotComponent from './Chatbot/ChatbotComponent'
import DownloadComponent from './Download/DownloadComponent'

const howItWorksCards = [
  { icon: Camera,   title: "Click a Pic",    desc: "Take a picture of your plant",  action: "camera" },
  { icon: Upload,   title: "Upload Photo",   desc: "Upload from your gallery",      action: "upload" },
  { icon: Download, title: "Download Report",desc: "Get your plant health report",  action: "report" },
  { icon: Bot,      title: "Ask Chatbot",    desc: "Chat about your plant issues",  action: "chat"   },
];


const Section2 = () => {
  return (
    <div className='flex-1 flex flex-col justify-center py-6 px-4 sm:py-8 sm:px-8 bg-gradient-to-t from-green-700 to-green-500'>
        <h2 className='text-xl sm:text-2xl md:text-[30px] font-semibold text-white text-center mb-6 sm:mb-8'>
              How It Works?
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8'>
                <CameraComponent {...howItWorksCards[0]}/>
                <UploadComponent {...howItWorksCards[1]}/> 
                <ChatbotComponent {...howItWorksCards[3]}/>
                <DownloadComponent {...howItWorksCards[2]}/>
            </div>
    </div>
  )
}

export default Section2;