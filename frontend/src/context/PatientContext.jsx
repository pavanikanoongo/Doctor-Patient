import React, { createContext, useState, useEffect } from 'react';
import { loginPatient } from '../utils/api'; // 👈 1. Import the API login function

export const PatientContext = createContext();

export const PatientContextProvider = (props) => {
    const [pToken, setPToken] = useState(null); // Initialize as null to handle initial check cleanly
    const [patientId, setPatientId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial check to load token from localStorage
    useEffect(() => {
        const token = localStorage.getItem('patientToken');
        const id = localStorage.getItem('patientId');
        if (token && id) {
            setPToken(token);
            setPatientId(id);
        }
        setIsLoading(false); // Finished initial loading check
    }, []);

    // 🎯 2. Implement the handleLogin function
    const handleLogin = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            // Call the API utility function
            const result = await loginPatient(email, password); 
            const tokenValue = result.token;
            const patientIdValue = result.token;

            console.log("Patient Login Success Message:", result.message);

            // Save token to localStorage and state
            localStorage.setItem('patientToken', tokenValue); 
            setPToken(tokenValue); 
             localStorage.setItem('patientId', patientIdValue); // <-- Save ID to local storage
            setPatientId(patientIdValue);  
            
            return { success: true, token: tokenValue, patId: patientIdValue, message: result.message };

        } catch (err) {
            setError(err.message);
            setIsLoading(false); 
            // Return failure result for Login.jsx to handle
            return { success: false, message: err.message || 'Login failed.' };
        } finally {
            // Since we navigate away on success, we don't need setIsLoading(false) on success, 
            // but we keep it here for cleanup/error path.
            if (error) { // Only set to false on error, otherwise the navigation handles it
                 setIsLoading(false);
            }
        }
    };
    
    // You would typically add a handleLogout function here too:
    const handleLogout = () => {
        localStorage.removeItem('patientToken');
        localStorage.removeItem('patientId');
        setPToken(null);
        setPatientId(null);
        // You might want to navigate to the login page here
    }


    const value = {
        pToken,
        patientId,
        setPToken,
        isLoading,
        error,
        handleLogin, // 👈 3. Expose the handler to consumers (Login.jsx)
        handleLogout,
    };
    
    // Optionally render a loading screen while checking localStorage
    if (isLoading && !pToken) {
        return <div className="loading-screen">Checking authentication...</div>;
    }

    return (
        <PatientContext.Provider value={value}>
            {props.children}
        </PatientContext.Provider>
    );
};