import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Camera as CameraIcon } from "lucide-react";

const CameraModal = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setError(
          "Camera access denied. Please allow camera permission in your browser.",
        );
      }
    };
    initCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(blob);
      stopCamera();
      onCapture(file, previewUrl);
    }, "image/jpeg");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-2xl p-4 w-full max-w-lg mx-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-raleway text-gray-800">
            Capture Image
          </h2>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error ? (
          <p className="text-red-500 text-center py-4">{error}</p>
        ) : (
          <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="max-w-full max-h-full"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {!error && (
          <button
            onClick={handleCapture}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          >
            <CameraIcon size={20} />
            Capture Photo
          </button>
        )}
      </div>
    </div>
  );
};

const CameraComponent = (props) => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const navigate = useNavigate();

  const handleCameraCapture = (file, previewUrl) => {
    setCameraOpen(false);
    navigate("/detect", {
      state: { imageFile: file, imagePreview: previewUrl },
    });
  };

  return (
    <>
      <div
        className="flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setCameraOpen(true)}
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mb-2 sm:mb-4 text-xl sm:text-2xl font-bold text-green-500">
          <props.icon className="w-5 h-5 sm:w-8 sm:h-8" />
        </div>
        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-white">
          {props.title}
        </h3>
        <p className="text-gray-300 tracking-wide text-xs sm:text-sm">
          {props.desc}
        </p>
      </div>

      {cameraOpen && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </>
  );
};

export default CameraComponent;
