import React, { useState, useEffect } from 'react';
import {specialityData} from '../assets/assets'
import {Link} from 'react-router-dom'
const BACKEND_API_BASE_URL = 'http://localhost:8080/api/doctors';
const SPECIALTY_API_URL = `${BACKEND_API_BASE_URL}/specialties`;

const SpecialityMenu = () => {
    // We expect 'specialties' to be an array of strings, e.g., ["Cardiology", "Neurology"]
    const [specialties, setSpecialties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                // Fetch the list of unique specialty names
                const response = await fetch(SPECIALTY_API_URL);
                
                if (!response.ok) {
                    // Check if the 404 is due to the endpoint not being created yet
                    if (response.status === 404) {
                         throw new Error("Endpoint not found. Ensure '/api/doctors/specialties' is implemented on the backend to return List<String>.");
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Ensure data is an array before setting state
                if (Array.isArray(data)) {
                    setSpecialties(data);
                    setError(null);
                } else {
                    throw new Error("Invalid data format received from backend.");
                }

            } catch (e) {
                console.error("Failed to fetch specialties:", e);
                setError(e.message || "Failed to load specialties. Please ensure the backend is running and the specialty endpoint is correct.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpecialties();
    }, []);

      const SpecialtyIcon = () => (
        // Custom SVG provided by the user, modified slightly for dynamic coloring
        <svg 
            className='w-12 h-12 sm:w-16 sm:h-16 mb-2' 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 640 640"
            // The fill is inherited from the parent text color class (e.g., text-indigo-600)
            fill="currentColor" 
        >
            <path d="M64 112C64 85.5 85.5 64 112 64L160 64C177.7 64 192 78.3 192 96C192 113.7 177.7 128 160 128L128 128L128 256C128 309 171 352 224 352C277 352 320 309 320 256L320 128L288 128C270.3 128 256 113.7 256 96C256 78.3 270.3 64 288 64L336 64C362.5 64 384 85.5 384 112L384 256C384 333.4 329 398 256 412.8L256 432C256 493.9 306.1 544 368 544C429.9 544 480 493.9 480 432L480 346.5C442.7 333.3 416 297.8 416 256C416 203 459 160 512 160C565 160 608 203 608 256C608 297.8 581.3 333.4 544 346.5L544 432C544 529.2 465.2 608 368 608C270.8 608 192 529.2 192 432L192 412.8C119 398 64 333.4 64 256L64 112zM512 288C529.7 288 544 273.7 544 256C544 238.3 529.7 224 512 224C494.3 224 480 238.3 480 256C480 273.7 494.3 288 512 288z"/>
        </svg>
    );

    if (isLoading) {
        return (
            <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
                <h1 className='text-3xl font-medium'>Find by Speciality</h1>
                <p className='text-center text-sm'>Loading specialities...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mt-4"></div>
            </div>
        );
    }

    if (error) {
         return (
            <div className='flex flex-col items-center gap-4 py-16 text-red-600' id='speciality'>
                <h1 className='text-3xl font-medium'>Find by Speciality</h1>
                <p className='text-center text-sm font-semibold'>{error}</p>
                <p className='text-xs text-gray-600 mt-2'>Using placeholder data for now.</p>
            </div>
        );
    }
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800 ' id='speciality'> 
      <h1 className='text-3xl font-medium '>Find by Speciality</h1>
      <p className='sm:w-1/3 text-center text-sm '>Simply browse through our extensive list of trusted doctors,schedule your appointment hassle-free</p>
      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
        {specialties.map((specialtyName, index)=>(
            <Link 
            key={specialtyName}
            onClick={()=>scrollTo(0,0)}className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' 
             to={`/doctors/${specialtyName}`}>
               <div className='w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-indigo-100 flex items-center justify-center mb-2 transition-all duration-300 group-hover:bg-indigo-200'>
                            {/* Icon Container with specific size and color */}
                            <div className="text-indigo-600 w-12 h-12 sm:w-16 sm:h-16">
                                <SpecialtyIcon />
                            </div>
                        </div>
                <p className='font-medium text-sm text-gray-700'>{specialtyName}</p>
            </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu
