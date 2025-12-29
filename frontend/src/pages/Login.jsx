// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTypeToggler from '../components/UserTypeToggler'; // Adjust path based on your structure
import { doctors, patients } from '../assets/assets'; // Import your local data
import { PatientContext } from './../context/PatientContext';
import { DoctorContext } from './../context/DoctorContext';
import { API_BASE_URL } from './../utils/api';

const Login = () => {
    const [userType, setUserType] = useState('patient'); // 'patient' or 'doctor'
    const [authMode, setAuthMode] = useState('login');   // 'login' or 'signup'
    const [fullName, setFullName] = useState(''); // For signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState(''); // E.g., 'Female', 'male', or use a select input
    const [dob, setDob] = useState(''); // Date of Birth
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');

    const [specialty, setSpecialty] = useState('');
    const [degree, setDegree] = useState('');
    const [experience, setExperience] = useState('');
    const [bio, setBio] = useState('');
    const [fees, setFees] = useState('');

    const doctorContext = useContext(DoctorContext) || {};
const { handleLogin: doctorHandleLogin } = doctorContext;
    
const patientContext = useContext(PatientContext) || {};
    const { handleLogin: patientHandleLogin } = patientContext;

    const navigate = useNavigate();

    const handleUserTypeChange = (newType) => {
        setUserType(newType);
        // Clear doctor-specific fields when switching away from 'doctor'
        if (newType === 'patient') {
            setSpecialty('');
            setDegree('');
            setExperience('');
            setBio('');
            setFees('');
        }
        setError(''); // Clear error message when switching
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
        let result;

        if (userType === 'patient') {
            
            // 👇 CHANGE 2: Call the Patient Context Handler
            if (!patientHandleLogin) {
                throw new Error("Patient login handler not available in context.");
            }
            
            result = await patientHandleLogin(email, password);

            if (result.success) {
                // The patient context handler sets the token and logs the message
                console.log(`Patient Login successful! Message: ${result.message}`);
                navigate('/'); 
            } else {
                // Handle error returned from the PatientContext
                throw new Error(result.message || 'Patient login failed.');
            }
            
        } else { // userType === 'doctor'
            
            // 🎯 CALL THE DOCTOR CONTEXT HANDLER (This function calls api.js/loginDoctor)
            if (!doctorHandleLogin) {
                throw new Error("Doctor login handler not available in context.");
            }
            
            result = await doctorHandleLogin(email, password);

            if (result.success) {
                // The context handler already sets the token and logs the message via console.log("Login Success Message:", result.message);
                console.log(`Login successful! Message: ${result.message}`);
                navigate('/doctor-dashboard');
            } else {
                // The context returns success: false and the error message on failure
                throw new Error(result.message || 'Doctor login failed.');
            }
        }
    } catch (err) {
        setError(err.message || 'An unexpected error occurred. Please try again.');
    }
};

 const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        let requiredFields = [fullName, email, password, phone, gender, addressLine1];

        if (userType === 'patient') {
            // 👇 CHANGE 2: Add DOB only if it's a patient signup
            requiredFields = [...requiredFields, dob]; 
        }

        if (userType === 'doctor') {
            // Doctor requires additional fields
            requiredFields = [...requiredFields, specialty, degree, experience, bio, fees];
        }

        if (requiredFields.some(field => !field)) {
            setError('All required fields must be filled out for signup.');
            return;
        }

        try {
            let endpoint = '';
            let requestBody = { 
                name: fullName, 
                email, 
                password,
                phone,
                gender,
                dob,
                addressLine1: addressLine1, 
                addressLine2: addressLine2,
                imageUrl: '/assets/profile_pic.png' // Use the camelCase field name
            };
            // Determine the correct API endpoint based on user type
            if (userType === 'patient') {
                endpoint = `${API_BASE_URL}/patients`;
            } else { // userType === 'doctor'
                endpoint = `${API_BASE_URL}/doctors`;
                requestBody = {
                    ...requestBody,
                    specialty,
                    degree,
                    experience,
                    bio,
                    fees: parseInt(fees, 10), // Ensure fees is sent as a number
                };
            }

            console.log(`Attempting POST to ${endpoint} for ${userType} signup. Payload:`, requestBody);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send the registration data
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                // If the response status is not 2xx, throw an error
                throw new Error(data.message || `Failed to register ${userType}. Status: ${response.status}`);
            }

            // Success handling: Clear form and switch to login
            console.log(`${userType} Signup successful:`, data);
            setError(`Success! Account created for ${userType}. Please login now.`);
            setAuthMode('login'); // Switch to login mode
            setFullName(''); 
            setEmail(''); 
            setPassword(''); 
            setPhone('');
            setGender('');
            setDob('');
            setAddressLine1('');
            setAddressLine2('');
            setSpecialty('');
            setDegree('');
            setExperience('');
            setBio('');
            setFees('');
            
        } catch (err) {
            console.error("Signup error:", err);
            // Display the error message from the thrown error
            setError(err.message || 'An unexpected network error occurred during signup.');
        }
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <UserTypeToggler userType={userType} setUserType={setUserType} />

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    {authMode === 'login' ? 'Login' : 'Create Account'}
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Please {authMode === 'login' ? 'login' : 'sign up'} to access your portal.
                </p>

                {error && (
                    <p className="text-red-600 text-sm text-center mb-4">{error}</p>
                )}

                <form onSubmit={authMode === 'login' ? handleLogin : handleSignup}>
                    {authMode === 'signup' && (
                        <>
                        <div className="mb-4">
                            <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        {userType === 'doctor' && (
                            <>
                               

                                {/* Specialty */}
                                <div className="mb-4">
                                    <label htmlFor="specialty" className="block text-gray-700 text-sm font-bold mb-2">Specialty</label>
                                    <input
                                        type="text"
                                        id="specialty"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                        value={specialty}
                                        onChange={(e) => setSpecialty(e.target.value)}
                                        placeholder="e.g., Cardiology, Dermatology"
                                        required={userType === 'doctor'}
                                    />
                                </div>
                                
                                {/* Degree */}
                                <div className="mb-4">
                                    <label htmlFor="degree" className="block text-gray-700 text-sm font-bold mb-2">Degree</label>
                                    <input
                                        type="text"
                                        id="degree"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                        value={degree}
                                        onChange={(e) => setDegree(e.target.value)}
                                        placeholder="e.g., MD, MBBS, PhD"
                                        required={userType === 'doctor'}
                                    />
                                </div>

                                {/* Experience */}
                                <div className="mb-4">
                                    <label htmlFor="experience" className="block text-gray-700 text-sm font-bold mb-2">Experience (Years)</label>
                                    <input
                                        type="number"
                                        id="experience"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        required={userType === 'doctor'}
                                    />
                                </div>
                                
                                {/* Fees */}
                                <div className="mb-4">
                                    <label htmlFor="fees" className="block text-gray-700 text-sm font-bold mb-2">Consultation Fee</label>
                                    <input
                                        type="number"
                                        id="fees"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                        value={fees}
                                        onChange={(e) => setFees(e.target.value)}
                                        required={userType === 'doctor'}
                                    />
                                </div>

                                {/* Bio (About Description) */}
                                <div className="mb-4">
                                    <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">About</label>
                                    <textarea
                                        id="bio"
                                        rows="3"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        required={userType === 'doctor'}
                                    />
                                </div>
                            </>
                        )}
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                pattern="[0-9]{3}-?[0-9]{3}-?[0-9]{4}" // Basic pattern for common formats
                                required
                            />
                        </div>

                        {/* Gender Field - Using a select dropdown for specific values */}
                        <div className="mb-4">
                            <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
                                Gender
                            </label>
                            <select
                                id="gender"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Female">Female</option>
                                <option value="male">Male</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Date of Birth Field */}
                        {userType === 'patient' && ( // 👈 CONDITION ADDED HERE
                            <div className="mb-4">
                                <label htmlFor="dob" className="block text-gray-700 text-sm font-bold mb-2">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    id="dob"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        
                        {/* Address Line 1 Field (Required) */}
                        <div className="mb-4">
                            <label htmlFor="addressLine1" className="block text-gray-700 text-sm font-bold mb-2">
                                Address Line 1
                            </label>
                            <input
                                type="text"
                                id="addressLine1"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={addressLine1}
                                onChange={(e) => setAddressLine1(e.target.value)}
                                required
                            />
                        </div>

                        {/* Address Line 2 Field (Optional, but included to match table) */}
                        <div className="mb-4">
                            <label htmlFor="addressLine2" className="block text-gray-700 text-sm font-bold mb-2">
                                Address Line 2 (Optional)
                            </label>
                            <input
                                type="text"
                                id="addressLine2"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={addressLine2}
                                onChange={(e) => setAddressLine2(e.target.value)}
                            />
                        </div>
                        </>
                    )}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 w-full"
                        >
                            {authMode === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                        className="text-indigo-600 hover:text-indigo-800 font-bold focus:outline-none"
                    >
                        {authMode === 'login' ? 'Sign Up Here' : 'Login Here'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;