import React, { useContext, useState, useEffect } from 'react'; // <-- ADD useState, useEffect
import { PatientContext } from './../context/PatientContext';


import { fetchPatientAppointments, cancelAppointment, rescheduleAppointmentAPI } from '../utils/api'; 


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

const formatAppointmentDate = (dateString) => {
    // Expects 'DD_MM_YYYY' (e.g., '05_11_2024')
    if (!dateString) return 'N/A';
    try {
        const parts = dateString.split('_');
        if (parts.length !== 3) throw new Error('Invalid format');
        
        const [day, month, year] = parts.map(p => parseInt(p, 10));
        
        // Month is 0-indexed in JavaScript Date (0=Jan, 11=Dec)
        const date = new Date(year, month - 1, day);

        // Options for the desired format: '09 NOV 2025'
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        
        // This relies on the browser's locale support, using 'en-US' for the English formatting requested
        return date.toLocaleDateString('en-US', options).toUpperCase().replace(/,/g, ''); 
        // Output will look like 'NOV 05, 2024'. We re-order below:
        const [monthPart, dayPart, yearPart] = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase().replace(/,/g, '').split(' ');
        return `${dayPart} ${monthPart} ${yearPart}`;

    } catch (e) {
        console.error("Date formatting failed for:", dateString, e);
        return dateString.replace(/_/g, '/'); // Fallback to DD/MM/YYYY
    }
};

const formatAppointmentTime = (timeString) => {
    // Expects 'HH:MM AM/PM' (e.g., '10:30 AM')
    if (!timeString) return 'N/A';
    return timeString; // Your provided time string is already in the desired format (11:00 AM)
};
const CancelConfirmationModal = ({ appt, onConfirm, onCancel }) => {
    // Determine the Doctor's name safely
    const doctorName = appt.doctor?.name || 'Unknown Doctor';
    const formattedDate = formatAppointmentDate(appt.slotDate);
    const formattedTime = formatAppointmentTime(appt.slotTime);
    const dateTime = `${formattedDate} at ${formattedTime}`;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm'>
                <h3 className='text-lg font-bold mb-4 text-red-700'>Confirm Cancellation</h3>
                <p className='text-sm text-zinc-700 mb-6'>
                    Are you sure you want to cancel the appointment with {doctorName} scheduled for {dateTime}
                    
                </p>
                <div className='flex justify-end space-x-3'>
                    <button
                        type="button"
                        onClick={onCancel} // 'No' button
                        className='px-4 py-2 text-sm font-semibold text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors'
                    >
                        No
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(appt.id)} // 'Yes' button
                        className='px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors'
                    >
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
const MyAppointments = () => {
    const { patientId } = useContext(PatientContext); 
    
    // 1. New State for fetched data and loading status
    const [appointments, setAppointments] = useState([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [actionStatus, setActionStatus] = useState(null);
    const [doctorsData, setDoctorsData] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
const [reschedulingAppt, setReschedulingAppt] = useState(null); // Stores the full appointment object being edited
const [newSlotDate, setNewSlotDate] = useState('');
const [newSlotTime, setNewSlotTime] = useState('');

const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [apptToCancel, setApptToCancel] = useState(null);


    const fetchDoctorDetails = async (docId) => {
    const response = await fetch(`http://localhost:8080/api/doctors/${docId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch doctor ${docId}`);
    }
    return response.json();
};

    const loadAppointments = async () => {
        setIsLoadingAppointments(true);
        setFetchError(null);
        try {
            const fetchedAppointments = await fetchPatientAppointments(patientId);
            setAppointments(fetchedAppointments);
            const uniqueDocIds = [...new Set(fetchedAppointments.map(appt => appt.docId))];
        const newDoctorsData = {};

        for (const docId of uniqueDocIds) {
            // Fetch doctor details for each unique ID
            const details = await fetchDoctorDetails(docId); 
            newDoctorsData[docId] = details;
        }

        setDoctorsData(newDoctorsData);
        } catch (error) {
            setFetchError(error.message);
            console.error("Failed to fetch appointments:", error);
        } finally {
            setIsLoadingAppointments(false);
        }
    };

    

    const handleCancelClick = (appt) => {
        setApptToCancel(appt);
        setIsCancelModalOpen(true);
    };

    // Handler that executes the API call after confirmation (Updated)
    const handleConfirmCancel = async (apptId) => {
        setIsCancelModalOpen(false); // Close modal first
        setActionStatus({ type: 'loading', message: `Canceling appointment ${apptId}...` });
        try {
            // API call to cancel
            const message = await cancelAppointment(apptId); 
            await loadAppointments(); // RE-FETCH data to update UI (status to 'Cancelled')
            setActionStatus({ type: 'success', message: message });
            
        } catch (error) {
            setActionStatus({ type: 'error', message: error.message });
        } finally {
            setApptToCancel(null);
            // Clear status message after 5 seconds
            setTimeout(() => setActionStatus(null), 5000);
        }
    };

    // Handler to close the confirmation modal without cancellation
    const handleCancelModalClose = () => {
        setIsCancelModalOpen(false);
        setApptToCancel(null);
    };
    const handleRescheduleClick = (appt) => {
    // Set the appointment to be rescheduled and open the modal
    setReschedulingAppt(appt); 
    setNewSlotDate('');
    setNewSlotTime('');
    setIsModalOpen(true);
};


    // 4. ACTION HANDLER: RESCHEDULE APPOINTMENT (Now uses imported rescheduleAppointment)
    const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!reschedulingAppt || !newSlotDate || !newSlotTime) return;

    const apptId = reschedulingAppt.id;

    setActionStatus({ type: 'loading', message: `Updating appointment ${apptId}...` });
    setIsModalOpen(false); // Close the modal immediately

    try {
        const payload = {
            slotDate: newSlotDate,
            slotTime: newSlotTime,
        };

        // Call PATCH API in api.js (ensure this function is defined)
        await rescheduleAppointmentAPI(apptId, payload); 
        
        // Re-fetch data to update the UI with the new slot details
        await loadAppointments(); 

        setActionStatus({ type: 'success', message: `Appointment successfully rescheduled to ${newSlotDate} at ${newSlotTime}.` });

    } catch (error) {
        setActionStatus({ type: 'error', message: `Failed to reschedule appointment: ${error.message}` });
    } finally {
        setReschedulingAppt(null);
        setTimeout(() => setActionStatus(null), 5000);
    }
};
    // 2. useEffect to fetch data when patientId changes
 useEffect(() => {
        if (patientId) {
            loadAppointments();
        } else {
            setIsLoadingAppointments(false);
        }
    }, [patientId]); 
 // Re-run effect whenever the patientId changes

    // --- Data Enhancement Logic (now runs on the 'appointments' state) ---

    if (!patientId) {
        return <p className='mt-12 text-red-500'>Please log in to view your appointments.</p>;
    }
    
    if (isLoadingAppointments) {
        return <p className='mt-12 text-blue-500'>Loading your appointments...</p>;
    }

    if (fetchError) {
         return <p className='mt-12 text-red-500'>Error loading appointments: {fetchError}</p>;
    }
    
    // The previous filtering step is now handled by the API call, 
    // so we skip the filter and directly enhance the fetched 'appointments' array.

    const enhancedAppointments = appointments.map((appt) => {
        const doctorDetails = doctorsData[appt.docId];
    
   return {
        ...appt,
        doctor: doctorDetails, // This object now contains the fetched name and details
    };
    });

    // Optional: Add sorting here
    enhancedAppointments.sort((a, b) => a.isCompleted - b.isCompleted);

    // --- JSX Rendering (Remains mostly the same, but uses 'enhancedAppointments') ---

    
    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
            {actionStatus && (
            <div className={`p-3 my-3 rounded-lg text-sm font-medium ${
                actionStatus.type === 'error' ? 'bg-red-100 text-red-700' :
                actionStatus.type === 'success' ? 'bg-green-100 text-green-700' :
                'bg-blue-100 text-blue-700'
            }`}>
                {actionStatus.message}
            </div>
        )}
            <div>
                {enhancedAppointments.length === 0 ? (
                    <p className='mt-4 text-zinc-500'>You have no appointments scheduled.</p>
                ) : (
                    enhancedAppointments.map((appt) => (
                        <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b relative' key={appt.id}> 
                        {appt.cancelled && (
        <span className='absolute top-0 right-0 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-bl-lg'>
            CANCELLED
        </span>
    )}
                            <div>
                                <div className="w-20 h-20">
                            <DoctorIcon />
                        </div>
                            </div>
                            <div className='flex-1 text-sm text-zinc-600'>
                                <p className='text-neutral-800 font-semibold'>{appt.doctor?.name || 'Unknown Doctor'}</p>
                                <p>{appt.doctor?.specialty}</p>
                               
                                <p className='text-sm mt-1'>
                                    <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>
                                    {appt.slotDate} | {appt.slotTime}
                                </p>
                                <p className='text-sm mt-1'>
                                    <span className='text-sm text-neutral-700 font-medium'>Fees:</span> ${appt.amount}
                                    <span className={`ml-3 text-xs font-medium ${appt.payment ? 'text-green-600' : 'text-red-600'}`}>
                                        ({appt.payment ? 'Paid' : 'Unpaid'})
                                    </span>
                                </p>
                            </div>
                            <div />
                            <div className='flex items-center justify-end gap-5 max-md:order-first max-md:w-full max-md:flex-row max-md:justify-center'>
    {appt.cancelled ? (
        // If cancelled is TRUE, only show Reschedule button
        <button 
            onClick={() => handleRescheduleClick(appt)}
            disabled={actionStatus?.type === 'loading'} 
            className='px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
        >
            Reschedule
        </button>
    ) : !appt.isCompleted ? (
        // Original logic for active appointments
        <>
            {/* Reschedule Button for NOT completed/cancelled appointments */}
            <button 
                onClick={() => handleRescheduleClick(appt)}
                disabled={actionStatus?.type === 'loading'} 
                className='px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
            >
                Reschedule
            </button>

            {/* Cancel Button for NOT completed/cancelled appointments */}
            <button
                onClick={() => handleCancelClick(appt)}
                disabled={actionStatus?.type === 'loading'}
                className='px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
                Cancel
            </button>
        </>
    ) : (
        // Logic for completed appointments
        <span className={`text-sm font-semibold text-center py-2 px-4 rounded-lg shadow-sm ${
            appt.status === 'Cancelled' ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'
        }`}>
            {appt.status || 'Completed'}
        </span>
    )}
</div>
                        </div>
                    ))
                )}
            </div>
            {isModalOpen && reschedulingAppt && (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
        <div className='bg-white p-6 rounded-lg shadow-2xl w-full max-w-md'>
            <h3 className='text-lg font-bold mb-4 text-neutral-800'>Reschedule Appointment</h3>
            <p className='text-sm text-zinc-600 mb-4'>Doctor: {reschedulingAppt.doctor?.name || 'Unknown Doctor'}</p>

            <form onSubmit={handleRescheduleSubmit}>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-zinc-700'>New Date</label>
                    <input
                        type="text" // Use "date" for date picker if running in a browser environment
                        placeholder="DD_MM_YYYY (e.g., 05_11_2024)"
                        value={newSlotDate}
                        onChange={(e) => setNewSlotDate(e.target.value)}
                        required
                        className='mt-1 p-2 block w-full border border-zinc-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                    />
                </div>
                <div className='mb-6'>
                    <label className='block text-sm font-medium text-zinc-700'>New Time</label>
                    <input
                        type="text" // Use "time" for time picker
                        placeholder="HH:MM AM/PM (e.g., 10:30 AM)"
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                        required
                        className='mt-1 p-2 block w-full border border-zinc-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                    />
                </div>
                <div className='flex justify-end space-x-3'>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className='px-4 py-2 text-sm font-semibold text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className='px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors'
                    >
                        Confirm Reschedule
                    </button>
                </div>
            </form>
        </div>
    </div>
)}
{/* --- Cancel Confirmation Modal (New) --- */}
            {isCancelModalOpen && apptToCancel && (
                <CancelConfirmationModal
                    appt={apptToCancel}
                    onConfirm={handleConfirmCancel}
                    onCancel={handleCancelModalClose}
                />
            )}
        </div>
    );
};

export default MyAppointments;