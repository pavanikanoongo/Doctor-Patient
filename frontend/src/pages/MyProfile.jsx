import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { assets, patients } from './../assets/assets';
import { PatientContext } from './../context/PatientContext';
import { API_BASE_URL } from './../utils/api';


export const PatientIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#008bf5" d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/></svg>);
const MyProfile = () => {

    const patientContext = useContext(PatientContext);
    const pToken = patientContext ? patientContext.pToken : null;

  const [userData, setUserData] = useState({
        name: "Loading...",
        image: null,
        email: '',
        phone: '',
        address: { line1: "", line2: "" },
        gender: '',
        dob: ''
    });

   const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchPatientData = async () => {
            if (!pToken) {
                setIsLoading(false);
                return;
            }

            const endpoint = `${API_BASE_URL}/patients/${pToken}`;
            

            try {
                const response = await fetch(endpoint);

                if (!response.ok) {
                    // Check for a 404/not found error
                    if (response.status === 404) {
                        throw new Error(`Patient with ID ${pToken} not found.`);
                    }
                    throw new Error(`Failed to fetch patient data: ${response.statusText}`);
                }
                
                const loggedInPatient = await response.json();
                

                setUserData({
                    name: loggedInPatient.name,
                    image: loggedInPatient.imageUrl || null, 
                    email: loggedInPatient.email,
                    phone: loggedInPatient.phone || 'N/A', 
                    address: {
                        // Backend uses addressLine1 and addressLine2
                        line1: loggedInPatient.addressLine1 || '',
                        line2: loggedInPatient.addressLine2 || ''
                    },
                    gender: loggedInPatient.gender || 'N/A',
                    dob: loggedInPatient.dob || 'N/A'
                });

            } catch (err) {
                console.error("Error fetching patient data:", err);
                setError(err.message || 'An error occurred while fetching your profile.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatientData();
    }, [pToken]);


    const handleSave = async () => {
        // 1. Prepare data (map nested address object back to flat keys for the API)
        const updatePayload = {
            // Note: We only include fields that are editable
            name: userData.name,
            phone: userData.phone,
            gender: userData.gender,
            dob: userData.dob,
            addressLine1: userData.address.line1, // Match Spring Boot model field
            addressLine2: userData.address.line2, // Match Spring Boot model field
        };

        const endpoint = `${API_BASE_URL}/patients/${pToken}`;
        
        try {
            // Set loading or disable button during API call
            // You might want to add a state for `isSaving` here

            const response = await fetch(endpoint, {
                method: 'PUT', // Using PATCH for partial updates is standard
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
            });

            if (!response.ok) {
                throw new Error('Failed to save profile changes.');
            }
            
            // Optional: If the API returns the updated object, you can parse it here.
            // const updatedPatient = await response.json(); 
            // setUserData(updatedPatient); 
            
            alert("Profile updated successfully!"); // User feedback
            setIsEdit(false); // Close edit mode on success

        } catch (error) {
            console.error("Save error:", error);
            setError('Could not save profile changes. Please try again.'); // Display error to user
        } 
    };
  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {userData.image && !imageError ? (
        <img 
            className='w-36 rounded' 
            src={userData.image} 
            alt="Profile" 
            // 4. Set the image error state on load failure
            onError={() => setImageError(true)} 
        />
      ) : (
        // 5. Render the custom PatientIcon inside a sized container
        <div className='w-36 h-36 rounded bg-gray-200 p-4 flex items-center justify-center'>
          <PatientIcon />
        </div>
      )}
      {
        isEdit
        ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={e=>setUserData(prev=>({...prev,name:e.target.value}))} />
        : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      }
      <hr className='bg-zinc-400 h-[1px] border-none'/>
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
        isEdit
        ? <input className='bg-gray-100 max-w-52' type="text" value={userData.phone} onChange={e=>setUserData(prev=>({...prev,phone:e.target.value}))} />
        : <p className='text-blue-400'>{userData.phone}</p>
      }
      <p className='font-medium'>Address:</p>
      {
        isEdit
        ? <p>
          <input className='bg-gray-50' onChange={(e)=>setUserData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))} value={userData.address.line1}type="text" />
          <br />
          <input className='bg-gray-50' onChange={(e)=>setUserData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))}  value={userData.address.line2}type="text" />
        </p>
        : <p className='text-gray-500'>
          {userData.address.line1}
          <br />
          {userData.address.line2}
        </p>
      }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender</p>
          {
            isEdit
            ? <select className='max-w-20 bg-gray-50' onChange={(e)=>setUserData(prev=>({...prev,gender:e.target.value}))} value={userData.gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            : <p className='text-gray-400'>{userData.gender}</p>
          }
          <p className='font-medium'>Birthday:</p>
          {
            isEdit
            ? <input className='max-w-28 bg-gray-100' type="date" onChange={(e)=>setUserData(prev=>({...prev,dob:e.target.value}))} value={userData.dob} />
            : <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>
      <div className='mt-10'>
        {
          isEdit
          ?<button 
                className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' 
                onClick={handleSave} 
            >
                Save Information
            </button>
          :<button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={()=>setIsEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default MyProfile
