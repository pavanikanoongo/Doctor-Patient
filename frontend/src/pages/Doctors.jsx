import React, { useState, useEffect,useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

const DOCTORS_BASE_ENDPOINT = 'http://localhost:8080/api/doctors'; 
const SPECIALTIES_ENDPOINT = `${DOCTORS_BASE_ENDPOINT}/specialties`;

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: Cancel the timer if value changes before the delay
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-call effect if value or delay changes

    return debouncedValue;
};
export const DoctorIcon = () => (
    <svg 
        className='w-full h-full text-indigo-500' 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 640 640" 
        fill="currentColor"
    >
        <path d="M320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72zM380 384.8C374.6 384.3 369 384 363.4 384L276.5 384C270.9 384 265.4 384.3 259.9 384.8L259.9 452.3C276.4 459.9 287.9 476.6 287.9 495.9C287.9 522.4 266.4 543.9 239.9 543.9C213.4 543.9 191.9 522.4 191.9 495.9C191.9 476.5 203.4 459.8 219.9 452.3L219.9 393.9C157 417 112 477.6 112 548.6C112 563.7 124.3 576 139.4 576L500.5 576C515.6 576 527.9 563.7 527.9 548.6C527.9 477.6 482.9 417.1 419.9 394L419.9 431.4C443.2 439.6 459.9 461.9 459.9 488L459.9 520C459.9 531 450.9 540 439.9 540C428.9 540 419.9 531 419.9 520L419.9 488C419.9 477 410.9 468 399.9 468C388.9 468 379.9 477 379.9 488L379.9 520C379.9 531 370.9 540 359.9 540C348.9 540 339.9 531 339.9 520L339.9 488C339.9 461.9 356.6 439.7 379.9 431.4L379.9 384.8z"/>
    </svg>
);
const Doctors = () => {
    // Get the specialty parameter from the URL (e.g., 'Neurologist')
    const { speciality } = useParams();
    const navigate = useNavigate();
    const searchInputRef = useRef(null);
    
    // State to hold the doctors for the CURRENT view (filtered or all)
    const [doctors, setDoctors] = useState([]); 
    const [specialties, setSpecialties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
    // Filter toggle state for mobile view
    const [showFilter, setShowFilter] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
   

    const handleImageError = (id) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };
    // const handleSearchSubmit = (e) => {
    //     if (e) e.preventDefault(); 
    //     setSubmittedSearchTerm(searchTerm);
    // };

    // --- Data Fetching Effect: Filters directly using the backend API ---
    useEffect(() => {
        const abortController = new AbortController();
    const signal = abortController.signal;
    setIsLoading(true);
    setFetchError(null);
    const fetchDoctors = async () => {
        
        let url = DOCTORS_BASE_ENDPOINT;
        const queryParams = [];

        // 1. Add specialty filter if present
        if (speciality) {
            queryParams.push(`specialty=${speciality}`);
        }
        if (debouncedSearchTerm.trim()) {
                queryParams.push(`name=${encodeURIComponent(debouncedSearchTerm.trim())}`); 
            }

        // 3. Construct the final URL with all parameters
        if (queryParams.length > 0) {
            url += '?' + queryParams.join('&');
        }
        
        console.log("Fetching doctors with URL:", url); // Useful for debugging

        try {
            const response = await fetch(url, { signal });
            
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("API Response Error Body:", errorBody);
                throw new Error(`HTTP error! Status: ${response.status} while fetching doctors.`);
            }

            const data = await response.json();
            
            if (Array.isArray(data)) {
                // Set the results from the API response (which is now filtered by both specialty and name)
                setDoctors(data); 
            } else {
                throw new Error("API returned unexpected data format. Expected an array.");
            }
            

        } catch (error) {
            console.error("Failed to fetch doctors:", error);
            setFetchError(error.message || "Failed to load doctor data. Please check the backend server.");
        } finally {
            if (!signal.aborted) {
                setIsLoading(false);
            }
        }
    };

    // Re-run the effect whenever 'speciality' route parameter OR 'searchTerm' state changes
    fetchDoctors();
    return () => {
        abortController.abort();
    };
}, [speciality, debouncedSearchTerm]);

     useEffect(() => {
        
        const fetchSpecialties = async () => {
            try {
                const response = await fetch(SPECIALTIES_ENDPOINT);
                if (!response.ok) {
                    console.error("Failed to fetch specialties list.");
                    return; 
                }
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    // Map the array of strings into the { speciality: 'key', label: 'Display Name' } format
                    const formattedSpecialties = data.map(s => ({
                        speciality: s, 
                        label: s 
                    }));

                    setSpecialties(formattedSpecialties);
                } else {
                    console.error("API returned unexpected data format for specialties. Expected an array of strings.");
                }
            } catch (error) {
                console.error("Error fetching specialties:", error);
            }
        };
        fetchSpecialties();
    }, []);
    // --- Helper component for filter links ---
    const FilterLink = ({ docSpeciality, label }) => {
        const isActive = speciality === docSpeciality;
        
        const handleClick = () => {
            // Navigate to the specific specialty path or base path
            const path = isActive ? '/doctors' : `/doctors/${docSpeciality}`;
            navigate(path);
        };

        return (
            <p 
                onClick={handleClick} 
                className={`
                    w-full sm:w-auto pl-4 py-2 pr-16 border rounded-lg transition-all cursor-pointer text-sm
                    hover:bg-indigo-50 hover:border-indigo-500
                    ${isActive ? "bg-indigo-100 text-indigo-800 font-medium border-indigo-400 shadow-md" : "bg-white text-gray-700 border-gray-300"}
                `}
            >
                {label}
            </p>
        );
    };
    
    

    // --- Rendering Logic: Loading, Error, and Content ---

    if (isLoading && doctors.length === 0) { 
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                <p className="ml-4 text-lg text-gray-600">Loading doctor list...</p>
            </div>
        );
    }
    
    if (fetchError) {
        return (
            <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg m-4">
                <p className="font-bold text-xl mb-2">Data Fetch Error</p>
                <p>{fetchError}</p>
                <p className="mt-2 text-sm">Please ensure the backend API is running and accessible at: <code className="bg-red-200 p-1 rounded text-xs">{DOCTORS_BASE_ENDPOINT}</code></p>
            </div>
        );
    }

    const doctorContent = doctors.length > 0 ? (
        doctors.map((item, index) => (
            <div 
                // Navigate to the appointment page using the doctor's unique ID
                onClick={() => {
                    // --- FIX & Safety Check: Ensure item.id is present before navigating ---
                    if (item.id) {
                        // This constructs the URL correctly: /appointment/123
                        console.log('Navigating to Appointment for ID:', item.id);
                        navigate(`/appointment/${item.id}`); 
                    } else {
                        // This error indicates the API object is missing the 'id' field
                        console.error("Navigation Failed: Doctor object is missing a required 'id' property. Check API data structure for item:", item);
                    }
                }} 
                key={item.id || index}
                className='border border-blue-200 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
            >
                 <div className='h-40 w-full bg-indigo-50 flex items-center justify-center overflow-hidden'>
                    {imageErrors[item.id] || !item.image ? (
                        // Display the SVG icon if error occurred or image is missing
                        <div className="w-20 h-20">
                            <DoctorIcon />
                        </div>
                    ) : (
                        // Display the doctor's image
                        <img 
                            className='w-full h-full object-cover' 
                            src={item.image} 
                            alt={item.name} 
                            // Use the custom error handler to set state
                            onError={() => handleImageError(item.id)} 
                        />
                    )}
                </div>
                <div className='p-4'>
                    <div className='flex items-center gap-2 text-sm text-green-600'>
                        <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                    </div>
                    <p className='text-gray-900 text-lg font-semibold truncate'>{item.name}</p>
                    <p className='text-indigo-600 text-sm'>{item.speciality}</p>
                    
                </div>
            </div>
        ))
    ) : (
        <div className="col-span-full text-center p-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
                No doctors found
                
            </p>
            
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Browse Doctors</h1>
            <p className='text-gray-600 text-lg mb-8'>Filter by specialty or view all available practitioners.</p>
            
            <div className="relative mb-8">
                <input 
                    key="doctor-search-input" 
                    type="text"
                    // ref={searchInputRef} // We can remove the ref since we don't need to manually focus anymore
                    placeholder="Search doctors by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Fast update for input control
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-gray-700"
                />
                {/* Optional: Add a subtle loading spinner next to the search icon while debouncing */}
                {isLoading && debouncedSearchTerm !== searchTerm && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin rounded-full border-2 border-t-2 border-indigo-200 border-t-indigo-600"></div>
                )}
                {/* Search Icon */}
                <svg 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
            {/* Filter Section (Responsive) */}
            <div className='flex flex-col gap-5 mb-10'>
                <button 
                    className={`py-2 px-4 border rounded-full text-sm font-medium transition-colors sm:hidden 
                        ${showFilter ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-600 border-indigo-400'}`} 
                    onClick={()=>setShowFilter(prev=>!prev)}
                >
                    {showFilter ? 'Hide Filters' : 'Show Filters'}
                </button>
                
                <div className={`flex flex-wrap gap-4 text-sm text-gray-600 ${showFilter ? 'flex':'hidden sm:flex'}`}>
                    {/* 'All Doctors' link */}
                    <p 
                        onClick={() => navigate('/doctors')} 
                        className={`
                            w-full sm:w-auto pl-4 py-2 pr-16 border rounded-lg transition-all cursor-pointer text-sm
                            hover:bg-gray-50 hover:border-gray-500
                            ${!speciality ? "bg-gray-200 text-gray-900 font-medium border-gray-400 shadow-md" : "bg-white text-gray-700 border-gray-300"}
                        `}
                    >
                        All Doctors
                    </p>
                    {/* Dynamic Specialty Links */}
                    {specialties.map(link => (
                        <FilterLink 
                            key={link.speciality} 
                            docSpeciality={link.speciality} 
                            label={link.label} 
                        />
                    ))}
                </div>
            </div>
            
            {/* Doctor Grid */}
            <div className='w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {doctorContent}
            </div>
        </div>
    );
}

export default Doctors;
