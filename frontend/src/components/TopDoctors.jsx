import React,{useState,useEffect} from 'react'

import { useNavigate } from 'react-router-dom';
import { assets } from './../assets/assets';

const DOCTORS_ENDPOINT = 'http://localhost:8080/api/doctors';

const DoctorIcon = () => (
    <svg 
        className='w-full h-full text-indigo-500' 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 640 640" 
        fill="currentColor"
    >
        <path d="M320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72zM380 384.8C374.6 384.3 369 384 363.4 384L276.5 384C270.9 384 265.4 384.3 259.9 384.8L259.9 452.3C276.4 459.9 287.9 476.6 287.9 495.9C287.9 522.4 266.4 543.9 239.9 543.9C213.4 543.9 191.9 522.4 191.9 495.9C191.9 476.5 203.4 459.8 219.9 452.3L219.9 393.9C157 417 112 477.6 112 548.6C112 563.7 124.3 576 139.4 576L500.5 576C515.6 576 527.9 563.7 527.9 548.6C527.9 477.6 482.9 417.1 419.9 394L419.9 431.4C443.2 439.6 459.9 461.9 459.9 488L459.9 520C459.9 531 450.9 540 439.9 540C428.9 540 419.9 531 419.9 520L419.9 488C419.9 477 410.9 468 399.9 468C388.9 468 379.9 477 379.9 488L379.9 520C379.9 531 370.9 540 359.9 540C348.9 540 339.9 531 339.9 520L339.9 488C339.9 461.9 356.6 439.7 379.9 431.4L379.9 384.8z"/>
    </svg>
);
const TopDoctors = ({ doctors = [], isLoading = true }) => {
  const navigate=useNavigate()
  const [imageErrors, setImageErrors] = useState({});

  // Function to handle image loading errors
  const handleImageError = (id) => {
      setImageErrors(prev => ({ ...prev, [id]: true }));
  };
  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-3">Loading top doctors...</p>
      </div>
    );
  }


  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 font-sans'>
      <h1 className='text-3xl font-bold'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-gray-500 text-sm'>Simply Browse through our extensive list of trusted doctors</p>
      
      {/* CHANGED: Used standard responsive grid classes */}
      <div className='w-full max-w-6xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-5 px-4'>
         {doctors.slice(0,10).map((item,index)=>(
            <div 
                onClick={()=>navigate(`/appointment/${item._id}`)} 
                key={index} 
                className='border border-blue-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl cursor-pointer hover:-translate-y-1 transition-all duration-300'
            >
                <div className='h-36 w-full bg-indigo-50 flex items-center justify-center overflow-hidden'>
                    {imageErrors[item._id] || !item.image ? (
                        <div className="w-20 h-20">
                            <div className="w-20 h-20">
                                <DoctorIcon />
                            </div>
                        </div>
                    ) : (
                        <img 
                            className='w-full h-full object-cover' 
                            src={item.image} 
                            alt={item.name} 
                            // Use the custom error handler to set state
                            onError={() => handleImageError(item._id)} 
                        />
                    )}
                </div>
                <div className='p-4'>
                    <div className='flex items-center gap-2 text-xs text-green-600 mb-1'>
                        <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                    </div>
                    <p className='text-gray-900 text-base font-semibold truncate'>{item.name}</p>
                    <p className='text-indigo-600 text-sm'>{item.speciality}</p>
                </div>
            </div>
         ))}
      </div>
      {/* CHANGED: Fixed the scrollTo syntax and improved button style */}
      <button 
          onClick={()=>{navigate('/doctors'); window.scrollTo(0,0);}} 
          className='bg-indigo-600 text-white font-medium px-12 py-3 rounded-full mt-10 hover:bg-indigo-700 transition-colors shadow-lg'
      >
          View All Doctors
      </button>
    </div>
  )
}
const Home = () => {
   const [allDoctors, setAllDoctors] = useState([]); 
   const [isLoading, setIsLoading] = useState(true);
   const [fetchError, setFetchError] = useState(null);

   // Fetch data from the API endpoint
   useEffect(() => {
       const fetchDoctors = async () => {
           setIsLoading(true);
           setFetchError(null);

           try {
               const response = await fetch(DOCTORS_ENDPOINT);
               
               if (!response.ok) {
                   throw new Error(`HTTP error! Status: ${response.status}`);
               }

               const data = await response.json();
               
               if (Array.isArray(data)) {
                   setAllDoctors(data); 
               } else {
                   throw new Error("API returned unexpected data format. Expected an array.");
               }

           } catch (error) {
               console.error("Failed to fetch doctors:", error);
               setFetchError(`Failed to load data. Please ensure your backend is running at ${DOCTORS_ENDPOINT}. Error: ${error.message}`);
           } finally {
               setIsLoading(false);
           }
       };

       fetchDoctors();
   }, []);

   // Render error message if fetching failed
   if (fetchError) {
     return (
       <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg m-4">
         <p className="font-bold text-xl mb-2">API Data Fetch Error</p>
         <p className="mt-2 text-sm bg-red-200 p-2 rounded break-words">
           {fetchError}
         </p>
       </div>
     );
   }

   return (
       <div className='bg-gray-50 min-h-screen'>
           <main>
              {/* The TopDoctors component receives the fetched data and loading status */}
              <TopDoctors doctors={allDoctors} isLoading={isLoading} />
           </main>
       </div>
   );
}

// NOTE: We export Home as the default component, which then renders TopDoctors.
export default Home
