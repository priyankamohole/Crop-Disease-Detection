import React from 'react'
import { jsPDF } from 'jspdf'

import config from '../../../config'

const API_BASE = config.API_URL;

const DownloadComponent = (props) => {

  const handleDownload = async () => {
    // Try to get the latest result from localStorage (set by Detection component)
    const storedResult = localStorage.getItem("cropcare_last_result");
    
    if (storedResult) {
      // If we have a real result, generate a server-side PDF
      try {
        const result = JSON.parse(storedResult);
        const response = await fetch(`${API_BASE}/api/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `CropCare_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          return;
        }
      } catch (err) {
        console.error("Server report failed, generating locally:", err);
      }
    }

    // Fallback: generate local PDF with placeholder data
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(34, 139, 34);
    doc.text("CropCare AI", 105, 20, null, null, "center");
    
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text("Plant Health Report", 105, 30, null, null, "center");
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`Date: ${dateStr}`, 20, 45);
    
    doc.setFont("helvetica", "bold");
    doc.text("Analysis Summary:", 20, 60);
    
    doc.setFont("helvetica", "normal");
    doc.text("- Plant Type: Unknown (No detection run yet)", 25, 70);
    doc.text("- Health Status: Pending Analysis", 25, 80);
    doc.text("- Detected Issues: None currently identified.", 25, 90);
    
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations:", 20, 110);
    
    doc.setFont("helvetica", "normal");
    doc.text("1. Upload a clear picture of the leaf on the Detect screen.", 25, 120);
    doc.text("2. Ensure the image has good lighting for accurate AI results.", 25, 130);
    doc.text("3. Download the report again after running a detection.", 25, 140);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated automatically by CropCare AI", 105, 280, null, null, "center");

    doc.save("Plant_Health_Report.pdf");
  };

  return (
    <div 
        onClick={handleDownload}
        className='flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity transform transition-transform hover:scale-105'
    >
        <div className='w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mb-2 sm:mb-4 text-xl sm:text-2xl font-bold text-green-500 shadow-lg'>
            <props.icon className='w-5 h-5 sm:w-8 sm:h-8' />
        </div>
        <h3 className='font-semibold text-sm sm:text-base md:text-lg text-white drop-shadow-md'>{props.title}</h3>
        <p className='text-gray-200 tracking-wide text-xs sm:text-sm drop-shadow-sm'>{props.desc}</p>
    </div>
  )
}

export default DownloadComponent;