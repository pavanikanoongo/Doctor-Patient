import { mockAppointments, doctors,patients } from '../assets/assets';

// Simulate a network delay for a better real-world feel
const API_DELAY = 500; // 0.5 second delay
export const API_BASE_URL = 'http://localhost:8080/api';

const handleResponse = async (response) => {
    const data = await response.json().catch(() => ({ message: 'No response body or body is empty.' }));
    
    if (!response.ok) {
        // Use the backend's error message, or a generic one if not available
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }
    return data;
};
/**
 * Simulates fetching all appointments from a server.
 * @returns {Promise<Array>} A promise that resolves with all mock appointments.
 */

/**
 * Simulates fetching appointments for a specific patient.
 * @param {string} patId - The ID of the currently logged-in patient.
 * @returns {Promise<Array>} A promise that resolves with the patient's filtered appointments.
 */
export const fetchAppointments = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments`);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error fetching all appointments:", error);
        throw new Error(`Could not connect to the server or retrieve appointments.`);
    }
};

export const fetchPatientAppointments = async (patientId) => {
    if (!patientId) {
        throw new Error("Patient ID is required to fetch appointments.");
    }
    // ************ Use the correct endpoint structure ************
    const url = `${API_BASE_URL}/appointments/patient/${patientId}`; 
    try {
        const response = await fetch(url);
        
        // Assuming handleResponse checks for errors and returns JSON data
        const data = await handleResponse(response); 
        return data; // This will return the array of appointments
    } catch (error) {
        console.error("Error fetching patient appointments:", error);
        throw new Error(`Failed to fetch appointments. ${error.message}`);
    }
};
export const fetchDoctorAppointments = async (docId) => {
    if (!docId) {
        throw new Error("Doctor ID is required to fetch appointments.");
    }
    
    const url = `${API_BASE_URL}/appointments/doctor/${docId}`; 
    
    try {
        const response = await fetch(url);
        
        // handleResponse will check for errors and parse the JSON data
        const data = await handleResponse(response); 
        const appointmentsArray = data.appointments || data;
        return { appointments: appointmentsArray };
    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        throw new Error(`Failed to fetch doctor appointments. ${error.message}`);
    }
};

/**
 * Simulates canceling an appointment.
 * In a real app, this would update the database.
 * @param {string} apptId - The ID of the appointment to cancel.
 * @returns {Promise<string>} A promise that resolves with a success message.
 */
export const cancelAppointment = async (apptId) => {
    if (!apptId) {
        throw new Error("Appointment ID is required for cancellation.");
    }
    // Correct endpoint structure for PATCH: /api/appointments/{id}/cancel
    const url = `${API_BASE_URL}/appointments/${apptId}/cancel`; 
    
    try {
        const response = await fetch(url, {
            method: 'PATCH', // Changed to PATCH for partial update (status change)
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Minimal body for a status change request
        });

        await handleResponse(response); 
        return `Appointment ${apptId} successfully cancelled`;
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        // Throw a custom error to the calling component
        throw new Error(`Failed to cancel appointment. ${error.message}`);
    }
};

/**
 * Simulates the reschedule process. 
 * NOTE: For simplicity, this mock only marks it as pending reschedule.
 * @param {string} apptId - The ID of the appointment to reschedule.
 * @returns {Promise<string>} A promise that resolves with a message about rescheduling.
 */
export const rescheduleAppointmentAPI = async (apptId, payload) => {
    const token = localStorage.getItem('token'); // or retrieve token as needed

    const response = await fetch(`${API_BASE_URL}/appointments/${apptId}/reschedule`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`, // Include if necessary
        },
        body: JSON.stringify(payload), // Send the new date/time payload
    });

    return handleResponse(response, `Error rescheduling appointment ${apptId}`);
};

/**
 * Authenticates the doctor using the backend API.
 * Endpoint: POST http://localhost:8080/api/auth/doctor/login
 * @param {string} email - The doctor's email.
 * @param {string} password - The doctor's password.
 * @returns {Promise<object>} A promise that resolves with { success: true, token: '...' } or throws an error.
 */
export const loginDoctor = async (email, password) => {
    // 1. Send the POST request to the authentication endpoint
    const response = await fetch(`${API_BASE_URL}/auth/doctor/login`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, password }),
    });
    
    // 2. Parse the response body (regardless of status code)
    const data = await response.json();

    // 3. Check for non-successful status codes (e.g., 401 Unauthorized, 500 Server Error)
    if (!response.ok) {
        // Throw an error with the backend's message
        throw new Error(data.message || 'Login failed. Please check credentials or server status.');
    }

    // 4. Success: The backend is expected to return { token: string, doctor: { ...profile } }
    return { 
        success: true, 
        token: data.token, // Use the token from the real API response
        doctor: data.doctor, // Include the doctor object if the API returns it
        message: data.message || `Welcome back!` 
    };
};

/**
 * Simulates a doctor logout.
 * @returns {Promise<object>} A promise that resolves instantly.
 */


/**
 * Simulates a patient login request.
 * @param {string} email - The patient's email.
 * @param {string} password - The patient's password.
 * @returns {Promise<object>} A promise that resolves with { success: true, token: '...' } or throws an error.
 */
export const loginPatient = async (email, password) => {
    // 1. Define the target endpoint using the base URL
    const API_URL = `${API_BASE_URL}/auth/patient/login`;

    try {
        // 2. Execute the POST request
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 3. Send the credentials in the request body
            body: JSON.stringify({ email, password }),
        });

        // 4. Parse the response body as JSON
        const data = await response.json();

        // 5. Handle HTTP errors (status codes 4xx or 5xx)
        if (!response.ok) {
            // The API is expected to return a JSON object with a 'message' field on failure
            console.error("API Login Failed:", data.message || 'Server error.');
            throw new Error(data.message || "Invalid email or password.");
        }

        // 6. Handle successful response (status code 200)
        // Assuming the server returns the patient's data and a token
        console.log(`API: Login successful. Patient token received.`);
        return {
            success: true,
            // Extract the token and patient object from the response data
            token: data.token,
            patient: data.patient, // Assuming the patient profile is returned
            message: data.message || 'Login successful.',
        };

    } catch (error) {
        // Handle network errors (e.g., 'Failed to fetch')
        console.error("Network or API Error:", error);
        // Re-throw the error so the calling context can display the alert
        throw error; 
    }
};


export const logoutDoctor = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("API: Logout simulated.");
            resolve({ success: true });
        }, 100);
    });
};

/**
 * Simulates fetching the Doctor Dashboard data.
 * This function calculates metrics by joining data from different mock arrays.
 * @param {string} docId - The ID of the currently logged-in doctor.
 * @returns {Promise<object>} A promise that resolves with structured dashboard data.
 */

export const fetchDoctorDashboardData = async (docId) => {
    try {
        // Use the existing async function to fetch data from the API endpoint
        const apiData = await fetchDoctorAppointments(docId);
        const doctorAppointments = apiData.appointments || [];

        // 1. Calculate Earnings (sum of fees for completed appointments for this doctor)
        let earnings = 0;
        doctorAppointments.forEach((item) => {
            if (item.payment) {
                // Assuming 'amount' is the fee paid for the appointment
                earnings += item.amount;
            }
        });

        // 2. Get unique patient IDs for this doctor
        const uniquePatientIds = new Set(doctorAppointments.map(app => app.patId));

        // 3. Get the doctor's name for the latest appointments list
        const currentDoctor = doctors.find(d => d._id === docId);

        const top5Appointments = doctorAppointments
            .slice() 
            .sort((a, b) => new Date(b.slotDate.replace(/_/g, '/')) - new Date(a.slotDate.replace(/_/g, '/'))) // Use slotDate for sorting
            .slice(0, 5);
        // 4. Get the latest appointments (top 5, most recent first)
        const latestAppointmentsPromises = top5Appointments.map(async (app) => {
            
            const patient = await fetchPatientDetails(app.patId); 
            const currentDoctor = doctors.find(d => d._id === docId); 
            return {
                id: app.id,
                doctorName: currentDoctor?.name || 'Unknown Doctor',
                patientName: patient?.name || 'Unknown Patient', 
                bookingDetails: `Booking on ${app.slotDate} at ${app.slotTime}`,
                avatarUrl: patient?.image || '/assets/profile_pic.png'
            };
        });
        const latestAppointments = await Promise.all(latestAppointmentsPromises);

        const dashData = {
            metrics: {
                doctors: doctors.length, 
                appointments: doctorAppointments.length, 
                patients: uniquePatientIds.size, 
                earnings: earnings,
            },
            latestAppointments: latestAppointments
        };
        
        
        
        // Return the final data structure
        return { success: true, dashData };

    } catch (error) {
        console.error("Error fetching or processing doctor dashboard data:", error);
        // Re-throw the error so the calling component can handle it
        throw new Error(`Failed to load dashboard data: ${error.message}`);
    }
};
export const fetchPatientDetails = async (patientId) => {
    try {
        
        const response = await fetch(`${API_BASE_URL}/patients/${patientId}`);
        const isJson = response.headers.get('content-type')?.includes('application/json');
        
       if (!response.ok) {
            let errorData = { message: `Failed to fetch patient with ID: ${patientId}.` };

            if (isJson) {
                // Safely parse JSON error message if content-type is correct
                errorData = await response.json().catch(() => ({})); 
            } else {
                // Handle the case where the server returns non-JSON (HTML/404)
                console.error(`API Error: Server returned non-JSON for ${patientId}. Status: ${response.status}`);
            }
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Assuming the API returns an object like: { name: '...', dob: '...', image: '...' }
        return data.patient || data || {};
        
    } catch (error) {
        console.error("Error fetching patient details:", error);
        // Fallback for UI in case of failure
        return { 
            name: `Unknown Patient (ID: ${patientId})`, 
            dob: null, 
            image: null 
        }; 
    }
};
export const fetchDoctorDetails = async (docId) => {
    if (!docId) {
        throw new Error("Doctor ID is required to fetch details.");
    }
    const url = `${API_BASE_URL}/doctors/${docId}`;

    try {
        const response = await fetch(url);
        const data = await handleResponse(response);
        // Assuming the API returns the doctor object directly
        return data.doctor || data;
    } catch (error) {
        console.error("Error fetching doctor details:", error);
        throw new Error(`Failed to fetch doctor profile. ${error.message}`);
    }
};
export const updateDoctorProfile = async (docId, payload) => {
    if (!docId) {
        throw new Error("Doctor ID is required for updating the profile.");
    }
    const url = `${API_BASE_URL}/doctors/${docId}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        // The response might return the updated doctor object
        const data = await handleResponse(response);
        return data.doctor || data;
    } catch (error) {
        console.error("Error updating doctor profile:", error);
        throw new Error(`Failed to save changes. ${error.message}`);
    }
};
