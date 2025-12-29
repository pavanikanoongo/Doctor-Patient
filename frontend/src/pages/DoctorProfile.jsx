import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from "../context/AppContext";

import { DoctorContext } from "../context/DoctorContext"; 
import { fetchDoctorDetails, updateDoctorProfile } from '../utils/api';
import { DoctorIcon } from './Doctors';


const Doctorprofile = () => {
    
    const { currency } = useContext(AppContext);
    
    
    const { currentDoctor, doctorToken } = useContext(DoctorContext);
    const docId = doctorToken || (currentDoctor && currentDoctor.id);

    const [profileData, setprofileData] = useState(currentDoctor);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const loadProfile = async () => {
            if (!docId) {
                setIsLoading(false);
                setError("Doctor is not logged in.");
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                // Fetch the latest doctor data from the API
                const data = await fetchDoctorDetails(docId);
                // The API response structure needs to match the component's state structure
                setprofileData({
        ...data,
        address: {
            line1: data.addressLine1 || '',
            line2: data.addressLine2 || ''
        }
    }); 
    
    // Ensure to remove the temporary flat fields from the state if they exist
    delete data.addressLine1;
    delete data.addressLine2;

} catch (err){
                console.error("Fetch profile error:", err);
                setError(err.message || "Failed to load doctor profile.");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [docId]);

    
const handleSave = async () => {
    if (!docId || !profileData) return;
    setIsLoading(true); 
    setError(null);

    const payload = {
        ...profileData, 
        addressLine1: profileData.address?.line1, 
        addressLine2: profileData.address?.line2,
    };
    
    delete payload.address;
    
    try {
        const updatedData = await updateDoctorProfile(docId, payload);
        
        // Update local state with the saved data returned by the API
        setprofileData({
            ...updatedData,
            address: {
                line1: updatedData.addressLine1 || '',
                line2: updatedData.addressLine2 || ''
            }
        });
        setIsEdit(false);
        alert("Profile updated successfully!"); 
    } catch (err) {
        console.error("Save profile error:", err);
        setError(err.message || "Failed to save profile changes.");
    } finally {
        setIsLoading(false); 
    }
};
    if (isLoading) {
        return <div className='p-8 text-lg font-medium text-blue-600'>Loading profile...</div>;
    }
    if (error) {
        return <div className='p-8 text-lg font-medium text-red-600'>{error}</div>;
    }
    
    if (!profileData) {
        return <div className='p-8 text-lg font-medium text-red-600'>Please log in to view your doctor profile.</div>;
    }
    console.log(profileData)
    return (
        <div>
            <div className='flex flex-col gap-4 m-5'>

                <div>
                    <div className='bg-primary/80 w-full sm:max-w-64 rounded-lg flex items-center justify-center overflow-hidden'>
                    <DoctorIcon className="h-full w-full object-cover" /> 
                </div>
                </div>
                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
                    {/*------ Doc info :name,degree,experience -----*/}
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>
                            {profileData.experience}
                        </button>
                    </div>
                    {/*---- Doc About ----*/}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>
                            About :
                        </p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                             {profileData.bio}
                        </p>
                    </div>
                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee : <span className='text-gray-800'>{currency}{isEdit ? <input type="number" onChange={(e) => setprofileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} /> : profileData.fees}</span>
                    </p>
                    <div className='flex gap-2 py-2'>
                        <p>
                            Address :
                        </p>
                        <p className='text-sm'>
                            {isEdit ? 
                                <input type="text" 
                                    onChange={(e) => setprofileData(prev => ({ 
                                        ...prev, 
                                        address: { ...(prev.address || {}), line1: e.target.value } // Creates address if undefined
                                    }))} 
                                   value={profileData.address?.line1 ?? ''} />
                                :profileData.address?.line1}
                            <br />
                            {isEdit ? 
                                <input type="text" 
                                    onChange={(e) => setprofileData(prev => ({ 
                                        ...prev, 
                                        address: { ...(prev.address || {}), line2: e.target.value }
                                    }))} 
                                    value={profileData.address?.line2 ?? ''} /> 
                                : profileData.address?.line2}
                        </p>
                    </div>


                    
                    {
                        isEdit
                            
                            ? <button 
                                onClick={handleSave} 
                                className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all disabled:opacity-50'
                                disabled={isLoading}
                              >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                            :
                            <button onClick={() => setIsEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>
                    }
                </div>
            </div>
        </div>
    )
}
export default Doctorprofile;