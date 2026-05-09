import { useNavigate } from "react-router-dom";
import bgImg from "../../images/bg-img1.jpg";
import Navbar from "../Navbar/Navbar";

const Section1 = () => {

   const navigate=useNavigate();


  return (
    <div>
    <div className="h-[50vh] md:h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${bgImg})` }}>
            <div className="flex flex-col h-full">
                <Navbar/>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-3 sm:p-4">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                    Detect Plant Diseases with AI
                </h1>
                <div className="max-w-2xl mx-auto text-center mt-2 sm:mt-4 px-2">
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-2 sm:mt-4 transition duration-300 hover:text-white">
                        Detect plant diseases in seconds with 
                        <span className="text-yellow-400 font-medium"> AI-powered analysis</span>. 
                        Simply upload or capture an image to get fast and accurate results.
                    </p>
                </div>
                <button
                    className="bg-yellow-500 text-black px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:bg-yellow-600 mt-4 sm:mt-6 transition duration-300"
                    onClick={()=>{navigate("/detect")}}
                >
                    Detect Now
                </button>
            </div>
    </div>
    </div>
    </div>
  );
};

export default Section1;
