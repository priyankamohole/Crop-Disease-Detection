import React, { useState, useEffect } from 'react'
import { UploadCloud, Loader2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import config from '../../../../config'

const API_BASE = config.API_URL;

const Detection = ({ setResult, setLoading }) => {
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.imageFile && location.state?.imagePreview) {
      setSelectedFile(location.state.imageFile);
      setPreviewUrl(location.state.imagePreview);
    }
  }, [location.state]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  }

  const handleDetect = async () => {
    if (!selectedFile) return;

    setIsDetecting(true);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Prediction failed");
      }

      const data = await response.json();
      setResult(data);
      // Store result for DownloadComponent to access
      localStorage.setItem("cropcare_last_result", JSON.stringify(data));
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      console.error("Detection error:", err);
    } finally {
      setIsDetecting(false);
      setLoading(false);
    }
  }

  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl w-full border-white/30'>
        <h1 className='font-raleway text-xl sm:text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2'>
            Upload Leaf Image
        </h1>
        <p className='text-gray-600 text-center mb-6 font-merriweather text-sm tracking-wide'>
            Upload an image of your plant leaf for AI analysis.
        </p>
        <div className="mb-4">
            <label className="flex flex-col items-center justify-center w-full h-36 sm:h-48 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50/50 hover:bg-green-50/70 transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-emerald-100/30 z-0" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10 relative w-full h-full">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <>
                        <UploadCloud size={24} className="text-green-600" />
                        <p className="mb-2 text-sm text-gray-500 font-merriweather mt-2">
                            <span className="font-semibold text-xs">Click to upload</span> / drag and drop
                        </p>
                        <p className="text-xs text-gray-500 font-merriweather">JPG, PNG, WEBP (MAX. 5MB)</p>
                      </>
                    )}
                </div>
                <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <button
                onClick={handleDetect}
                className={`w-full py-3 sm:py-4 rounded-xl font-raleway text-base sm:text-lg tracking-wide font-semibold text-white transition-all flex items-center justify-center gap-2 ${selectedFile && !isDetecting ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={!selectedFile || isDetecting}
              >
            {isDetecting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              'Detect Disease'
            )}
        </button>
    </div>
  )
}

export default Detection;