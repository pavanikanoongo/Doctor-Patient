import React,{ useState,useContext,useEffect}  from 'react'
import {useParams} from 'react-router-dom'
import { AppContext } from './../context/AppContext';
import RelatedDoctors from './../components/RelatedDoctors';
import { assets } from './../assets/assets';

const DOCTORS_BASE_ENDPOINT = 'http://localhost:8080/api/doctors';
const APPOINTMENTS_ENDPOINT = 'http://localhost:8080/api/appointments';

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

const Appointment = () => {
  const {docId:doctorId}=useParams();
  console.log('Appointment Page loaded. Doctor ID from URL:', doctorId);
  const {doctors,currencySymbol}=useContext(AppContext)
  const daysOfWeek=['SUN','MON','TUE','WED','THU','FRI','SAT']

  const [docInfo,setDocInfo]=useState(null)
  const [docSlots,setDocSlots]=useState([])
  const [slotIndex,setSlotIndex]=useState(0)
  const [slotTime,setSlotTime]=useState('')

  const [isLoading, setIsLoading] = useState(true); 
  const [fetchError, setFetchError] = useState(null); 
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [bookingStatus, setBookingStatus] = useState(null); 

    const fetchDocInfo=async()=>{
    if (!doctorId) {
            console.error("AppointmentScheduler: doctorId is missing. Cannot fetch doctor details.");
            setFetchError("Doctor ID not found. Please check the URL.");
            setIsLoading(false);
            // This prevents the problematic fetch from line 38, fixing the 400 error.
            return;
        }
    setIsLoading(true);
    setFetchError(null);
    
    // Construct the endpoint URL using the ID
    const url = `${DOCTORS_BASE_ENDPOINT}/${doctorId}`;

    try {
        const response = await fetch(url);

        if (response.status === 404) {
             throw new Error(`Doctor with ID ${doctorId} not found.`);
        }
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDocInfo(data);
    } catch (error) {
        console.error("Error fetching doctor details:", error);
        setFetchError(error.message || "Failed to load doctor data.");
        setDocInfo(null);
    } finally {
        setIsLoading(false);
    }
  }

const bookAppointment = async (payNow) => {
    setIsLoading(true); // Start loading state for booking
    setFetchError(null);
    setShowConfirmation(false); // Hide initial confirmation modal while processing
    setBookingStatus(null); 

    try {
        const selectedSlot = docSlots[slotIndex].find(slot => slot.time === slotTime);

        if (!selectedSlot) {
            throw new Error("No time slot selected.");
        }

        const d = selectedSlot.datetime;

        // 1. FIX DATE FORMAT: Change from MM_dd_yyyy to dd_MM_yyyy
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        // **REQUIRED CHANGE 1: Swapping Month and Day for dd_MM_yyyy**
        const dateOnly = `${day}_${month}_${year}`; 

        // 2. FIX TIME FORMAT: Change from HH:mm:ss to hh:mm a
        
        // Get 12-hour time and AM/PM indicator
        // We use Intl.DateTimeFormat to reliably get the 12-hour format with AM/PM
        const timeOnly = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h12' // Ensure 12-hour format
        }).format(d).toUpperCase().replace(' ', '');
        
        // The output will be something like "10:00AM" or "02:30PM".
        // The DTO expects "hh:mm a" which has a space (e.g., "10:00 AM")
        
        // **REQUIRED CHANGE 2: Formatting Time to hh:mm a**
        // Since slotTime state is already in a clean 12-hour format from getAvailableSlots:
        // Let's re-use the format that the slot selection uses, but ensure it's upper-case and has the space.
        
        // Re-use the time from the selected slot, but normalize the casing/spacing.
        // Example slotTime state: "10:00 AM" or "2:30 PM" (from toLocaleTimeString)
        let formattedTimeForBackend = slotTime;
        
        // Handle potential lowercase from the existing slot generation logic
        if (!formattedTimeForBackend.includes('M')) {
            // Recalculate if slotTime is not guaranteed to be in 12-hour format
            const hours = d.getHours();
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHour = String(hours % 12 || 12);
            
            // Format for hh:mm a (with space, uppercase AM/PM)
            formattedTimeForBackend = `${displayHour.padStart(2, '0')}:${minutes} ${ampm}`;
        } else {
            // If slotTime is already in "H:mm AM/PM" format, just ensure the space.
            formattedTimeForBackend = formattedTimeForBackend.toUpperCase();
            if (formattedTimeForBackend.length < 8) {
                // If it's "2:00 PM", fix hour padding: "02:00 PM"
                formattedTimeForBackend = formattedTimeForBackend.replace(/^(\d):/, '0$1:');
            }
        }
        
        // The final time string to send (must match "hh:mm a")
        const timeOnlyToSend = formattedTimeForBackend;


        // 2. Use a mock patient ID string 
        const patientId = 1; 

        // 3. Construct the payload matching the DTO
        const appointmentData = {
            doctorId: doctorId,
            patientId: patientId, 
            slotDate: dateOnly,      // NOW formatted as dd_MM_yyyy
            slotTime: timeOnlyToSend, // NOW formatted as hh:mm a (e.g., "02:00 PM")
            amount: docInfo.fees,    
            payment: payNow,         
            cancelled: false,        
            isCompleted: false,      
        };

        console.log("Attempting POST with payload:", appointmentData);

        // --- ACTUAL FETCH CALL ---
        const response = await fetch(APPOINTMENTS_ENDPOINT, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // Add your Authorization header here if needed
            },
            body: JSON.stringify(appointmentData),
        });

        if (!response.ok) {
            // Robust error extraction for 400 Bad Request
            let errorDetail = `HTTP Error ${response.status}: Failed to book appointment.`;
            try {
                const errorJson = await response.json();
                errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson);
            } catch (e) {
                const text = await response.text();
                errorDetail = text || errorDetail;
            }
            throw new Error(errorDetail);
        }
        
        // Success Logic (Updated to use boolean payment status)
        const paymentDescription = payNow ? 'Paid Now' : 'Pending (Pay Later)';
        const statusMessage = `Success! Appointment booked for ${docInfo.name}. Payment: ${paymentDescription}.`;
        setBookingStatus({ type: 'success', message: statusMessage });
        console.log(statusMessage);
        setSlotTime(''); 
        setTimeout(() => setBookingStatus(null), 5000); // Clear toast
        
    } catch (error) {
        console.error("Booking failed:", error);
        // Display the detailed error message captured above
        setBookingStatus({ type: 'error', message: `Booking Failed: ${error.message || 'Network error occurred.'}` });
        setTimeout(() => setBookingStatus(null), 8000); // Keep error visible longer
    } finally {
        setIsLoading(false); // End loading state
        setShowConfirmation(false); // Close the booking modal regardless of success/fail
    }
};
  const getAvailableSlots=async()=>{
    const slots = [] 

    //getting current date
    let today=new Date()

    for(let i=0 ; i<7; i++){
      //getting date with index
      let currentDate=new Date(today)
      currentDate.setDate(today.getDate()+i)

      //setting end time of date with index
      let endTime=new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)

      //setting hours
      if(today.getDate()===currentDate.getDate()){
        currentDate.setHours(currentDate.getHours()>10 ? currentDate.getHours()+1:10)
        currentDate.setMinutes(currentDate.getMinutes()>30 ? 30:0)
      }
      else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots=[]

      while(currentDate<endTime){
        let formattedTime=currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
        //add slots to array
        timeSlots.push({
          datetime:new Date(currentDate),
          time:formattedTime
        })
        //increment current time by 30 min
        currentDate.setMinutes(currentDate.getMinutes()+30)
      }
      slots.push(timeSlots)
    }
    setDocSlots(slots)
  }
   const handleBookAppointment = () => {
      if (!docInfo || !docSlots.length || !slotTime) {
          console.log("Please select a date and time slot.");
          return;
      }
      const selectedSlot = docSlots[slotIndex].find(slot => slot.time === slotTime);
      
      console.log(`Booking appointment for ${docInfo.name} on ${selectedSlot.datetime.toDateString()} at ${slotTime}`);
      setShowConfirmation(true);
  }

  useEffect(()=>{
    if (doctorId) {
      fetchDocInfo()
    } else {
        // Stop loading if the ID is missing entirely
        setIsLoading(false); 
        setFetchError("Doctor ID is missing in the URL. Please check the route.");
    }
  },[doctors,doctorId])

  useEffect(()=>{
getAvailableSlots()
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots)
  },[docSlots])

   if (isLoading) {
    return (
        <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="ml-4 text-lg text-gray-600">Loading doctor details...</p>
        </div>
    );
  }

  if (fetchError) {
    return (
        <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg m-4 max-w-lg mx-auto shadow-md">
            <p className="font-bold text-xl mb-2">Error Loading Doctor</p>
            <p>{fetchError}</p>
            <p className="mt-2 text-sm">Please ensure the backend API is running and accessible at: <code className="bg-red-200 p-1 rounded text-xs">{DOCTORS_BASE_ENDPOINT}/{doctorId}</code></p>
        </div>
    );
  }

 return docInfo && (
    <div className='p-4 md:p-8 max-w-7xl mx-auto'>
      {/* Booking Status Toast */}
    {bookingStatus && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-xl text-white font-semibold z-[60] transition-opacity duration-300 ${bookingStatus.type === 'success' ? 'bg-green-500' : 'bg-red-600'}`}>
            <p>{bookingStatus.message}</p>
        </div>
    )}
      {/* Confirmation Modal */}
      {showConfirmation && docInfo && docSlots.length > 0 && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Confirm Your Appointment</h3>
            <div className="text-left text-gray-700 mb-6 border-b pb-4">
                <p className='mb-2'>
                    <span className='font-semibold'>Doctor:</span> {docInfo.name}
                </p>
                <p className='mb-2'>
                    <span className='font-semibold'>Date:</span> {docSlots[slotIndex][0].datetime.toDateString()}
                </p>
                <p className='mb-2'>
                    <span className='font-semibold'>Time:</span> {slotTime.toLowerCase()}
                </p>
                <p className='text-xl font-bold text-indigo-600 mt-3'>
                    <span className='text-gray-700 font-semibold'>Fees:</span> {currencySymbol}{docInfo.fees}
                </p>
            </div>

            <p className="text-sm text-gray-600 mb-4">Choose your payment option:</p>

            <div className="flex justify-between gap-4">
                {/* Pay Now Button */}
                <button 
                    onClick={() => bookAppointment(true)} 
                    className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-full transition-colors shadow-md'
                >
                    Pay Now
                </button>
                {/* Pay Later Button */}
                <button 
                    onClick={() => bookAppointment(false)} 
                    className='flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium px-4 py-2 rounded-full transition-colors shadow-md'
                >
                    Pay Later
                </button>
            </div>

            {/* Close Button/Cancel */}
            <button 
                onClick={() => setShowConfirmation(false)} 
                className='text-sm text-gray-500 mt-4 hover:text-gray-700'
            >
                Cancel
            </button>
        </div>
    </div>
)}

      {/*-----Doctor Details-----*/}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <DoctorIcon />
        </div>

        <div className='flex-1 border border-gray-200 rounded-xl p-8 py-7 bg-white mx-0 mt-[-80px] sm:mt-0 shadow-md'>
          {/* Name,degree,experience */}
          <p className='flex items-center gap-2 text-3xl font-extrabold text-gray-900'>
            {docInfo.name} 
            <img className='w-6 text-green-500' src={assets.verified_icon} alt="Verified" />
          </p>
          <div className='flex flex-wrap items-center gap-2 text-base mt-1 text-gray-600'>
            <p className='text-indigo-600 font-medium'>{docInfo.specialty}</p>
            <span className='text-gray-400'>|</span>
            <p>{docInfo.degree}</p>
            <span className='text-gray-400'>|</span>
            <span className='py-0.5 px-3 border border-indigo-300 bg-indigo-50 text-xs font-semibold rounded-full text-indigo-700'>{docInfo.experience}</span>
          </div>

          {/*---Doctors About---*/}
          <div>
            <p className='flex items-center gap-1 text-lg font-bold text-gray-900 mt-5'>
              About <img className='w-4 h-4 text-gray-500' src={assets.info_icon} alt="Info" />
            </p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1 leading-relaxed'>{docInfo.bio}</p>
          </div>
          <p className='text-xl text-gray-700 font-bold mt-6 pt-4 border-t border-gray-100'>
            Consultation Fee: <span className='text-indigo-600 ml-1'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/*---Booking SLots---*/}
      <div className='sm:ml-72 font-medium text-gray-700 mt-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Select Booking Slot</h2>
    
        {/* Date Selector */}
        <div className='flex gap-3 items-center w-full overflow-x-scroll scrollbar-hide py-2' >
          {
            docSlots.length > 0 && docSlots.map((item,index)=>(
              <div 
                  onClick={()=>{setSlotIndex(index); setSlotTime('');}} 
                  className={`text-center py-4 min-w-20 rounded-xl cursor-pointer transition-all duration-200 shadow-md flex-shrink-0
                      ${slotIndex===index 
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 transform scale-105' 
                        : 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                      }`} 
                  key={index}
              >
                <p className='text-sm font-semibold'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p className='text-2xl font-bold'>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>

        {/* Time Slots */}
        {docSlots.length > 0 && docSlots[slotIndex].length > 0 ? (
          <>
            <p className='mt-6 mb-3 text-lg font-semibold text-gray-800'>Available Time Slots</p>
            <div className='flex flex-wrap gap-3 w-full mt-4'>
              {docSlots[slotIndex].map((item,index)=>(
                <p 
                  onClick={()=>setSlotTime(item.time)} 
                  className={`text-sm font-medium flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-colors duration-150
                    ${item.time===slotTime 
                      ? 'bg-indigo-500 text-white shadow-md' 
                      : 'text-indigo-600 border border-indigo-400 bg-indigo-50 hover:bg-indigo-100'
                    }`} 
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
            </div>
          </>
        ) : (
          <p className='mt-6 text-gray-500'>No slots available for the selected day.</p>
        )}

        <button 
          onClick={handleBookAppointment}
          disabled={!slotTime}
          className={`text-white text-base font-semibold px-10 py-3 rounded-full my-6 transition-all duration-300 shadow-lg
              ${!slotTime 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'
              }`}
        >
          Book Appointment
        </button>
      </div>

      {/*---Listing Related Doctors --*/}
{/*       <RelatedDoctors docId={doctorId} speciality={docInfo.speciality}/> */}
    </div>
  )
}

export default Appointment;