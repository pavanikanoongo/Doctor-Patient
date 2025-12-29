import React, { useState, useEffect, useCallback } from 'react';

// --- INLINE SVG ICON REPLACEMENTS (for Lucide-React) ---
const IconPlus = (props) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconX = (props) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconPencil = (props) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
const IconEye = (props) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconSend = (props) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 15 2 11 22 2"></polygon></svg>;
const IconRotateCcw = (props) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6"></path><path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path></svg>;
const IconStethoscope = (props) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a9 9 0 0 0-9 9v11h2v-9a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v9h2V11a9 9 0 0 0-9-9z"></path><path d="M9 11h6"></path><path d="M7 11v2"></path><path d="M17 11v2"></path></svg>;

// --- MOCK DATA FOR SINGLE-FILE RUNNABILITY (Based on src/assets/assets.js) ---
const MOCK_DOCTOR_ID = 'doc1';
const MOCK_DOCTOR_NAME = 'Dr. Evelyn Reed';

const mockPrescriptions = [
    { 
        id: 'presc1', 
        appointmentId: 'appt1', 
        dateWritten: '2025-10-10',
        doctorName: MOCK_DOCTOR_NAME,
        content: "Medication: Atorvastatin (20mg) - Take 1 tablet daily for 30 days.\nFollow-up: Schedule appointment in 6 weeks."
    },
    { 
        id: 'presc2', 
        appointmentId: 'appt3', 
        dateWritten: '2025-10-11',
        doctorName: MOCK_DOCTOR_NAME,
        content: "Medication: Amoxicillin (500mg) - Take 1 capsule three times a day for 7 days.\nNotes: Stay hydrated."
    }
];

const mockAppointmentsData = [
    { id: 'appt1', patientName: 'Alice Johnson', docId: MOCK_DOCTOR_ID, disease: 'Hypertension', date: '2025-10-10', time: '10:00 AM' },
    { id: 'appt2', patientName: 'Bob Smith', docId: MOCK_DOCTOR_ID, disease: 'Acute Bronchitis', date: '2025-10-12', time: '02:30 PM' }, // No prescription
    { id: 'appt3', patientName: 'Charlie Davis', docId: MOCK_DOCTOR_ID, disease: 'Common Cold', date: '2025-10-11', time: '11:30 AM' },
    { id: 'appt4', patientName: 'Diana Prince', docId: 'doc2', disease: 'Routine Checkup', date: '2025-10-13', time: '09:00 AM' }
];
// --- END MOCK DATA ---

/**
 * Utility function to enrich appointments with prescription status based on the current local data.
 */
const getEnrichedAppointments = (appointments, prescriptions) => {
    return appointments
        .filter(appt => appt.docId === MOCK_DOCTOR_ID)
        .map(appt => {
            const existingPrescription = prescriptions.find(presc => presc.appointmentId === appt.id);
            return {
                ...appt,
                hasPrescription: !!existingPrescription,
                prescription: existingPrescription || null
            };
        });
};


// --- Prescription Modal Component ---
const PrescriptionModal = ({ appointment, currentPrescription, onClose, onSave }) => {
    // Initialize the prescription text with existing content if editing, otherwise empty.
    const [prescriptionText, setPrescriptionText] = useState(currentPrescription?.content || '');
    const isEditMode = !!currentPrescription;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the updated content and whether it's an edit action to the save handler
        onSave(prescriptionText, isEditMode);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all overflow-hidden border border-blue-400/30">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-700/50">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                        <IconStethoscope className="mr-2 w-6 h-6 text-blue-600 dark:text-blue-300" />
                        {isEditMode ? 'View & Edit' : 'New'} Prescription for <span className="ml-1 text-blue-600 dark:text-blue-300">{appointment.patientName}</span>
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
                    >
                        <IconX className="w-5 h-5" />
                    </button>
                </div>

                {/* Patient Details */}
                <div className="p-5 text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700 space-y-1">
                    <p><strong>Diagnosis:</strong> <span className="font-semibold text-gray-800 dark:text-gray-100">{appointment.disease}</span></p>
                    {isEditMode && <p><strong>Date Written:</strong> {currentPrescription.dateWritten}</p>}
                    <p><strong>Appointment Time:</strong> {appointment.date} at {appointment.time}</p>
                </div>

                {/* Prescription Form */}
                <form onSubmit={handleSubmit} className="p-5">
                    <label htmlFor="prescription" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Prescription Content (Medication, Dosage, Instructions, Follow-up)
                    </label>
                    <textarea
                        id="prescription"
                        value={prescriptionText}
                        onChange={(e) => setPrescriptionText(e.target.value)}
                        rows={10}
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-50 resize-none transition shadow-inner"
                        placeholder="Format the prescription clearly, e.g.:&#10;&#10;1. Drug Name (Strength): Dosage, Route, Frequency (e.g., BID)&#10;2. Further Instructions/Tests:&#10;3. Next Follow-up: (e.g., 2 weeks)"
                        required
                    />

                    {/* Footer Buttons */}
                    <div className="flex justify-end space-x-3 mt-5 pt-3 border-t dark:border-gray-700">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex items-center px-5 py-2.5 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-50 dark:hover:bg-gray-500 transition shadow-md font-medium"
                        >
                            <IconX className="w-4 h-4 mr-1" />
                            Close
                        </button>
                        <button 
                            type="submit" 
                            className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-500/50 disabled:opacity-50 font-medium"
                            disabled={!prescriptionText.trim()}
                        >
                            <IconSend className="w-4 h-4 mr-2" />
                            {isEditMode ? 'Update Prescription' : 'Finalize Prescription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main Prescriptions Component ---
const Prescriptions = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalMode, setModalMode] = useState(null); // 'view', 'write', 'edit'
    const [localPrescriptions, setLocalPrescriptions] = useState(mockPrescriptions);

    // Effect to calculate and load the enriched list of appointments
    useEffect(() => {
        const enrichedAppointments = getEnrichedAppointments(mockAppointmentsData, localPrescriptions);
        // Sort by date/time, putting pending (non-prescribed) appointments first
        enrichedAppointments.sort((a, b) => {
            if (a.hasPrescription !== b.hasPrescription) {
                return a.hasPrescription ? 1 : -1; // Pending first
            }
            return new Date(a.date) - new Date(b.date); // Then by date
        });
        setAppointments(enrichedAppointments);
    }, [localPrescriptions]);

    // Handlers for Modal
    const handleOpenModal = (appointment, mode) => {
        setSelectedAppointment(appointment);
        setModalMode(mode);
    };

    const handleCloseModal = () => {
        setSelectedAppointment(null);
        setModalMode(null);
    };

    // Handler for saving a prescription (simulating API interaction)
    const handleSavePrescription = useCallback((content, isEdit) => {
        if (!selectedAppointment) return;

        const now = new Date().toISOString().split('T')[0];

        if (isEdit) {
            // Simulate UPDATE: Find and modify existing prescription
            setLocalPrescriptions(prev => prev.map(p => 
                p.appointmentId === selectedAppointment.id 
                ? { ...p, content: content, dateWritten: now } 
                : p
            ));
        } else {
            // Simulate CREATE: Add new prescription
            const newPrescription = {
                id: 'presc-' + Date.now(), // Mock ID generation
                appointmentId: selectedAppointment.id,
                dateWritten: now,
                doctorName: MOCK_DOCTOR_NAME,
                content: content,
            };
            setLocalPrescriptions(prev => [...prev, newPrescription]);
        }

        handleCloseModal();
    }, [selectedAppointment]);


    // Determine the relevant icon and action button for an appointment
    const getActionProps = (appointment) => {
        if (appointment.hasPrescription) {
            return {
                statusText: 'Prescribed',
                statusClass: 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 border border-green-300 dark:border-green-700',
                actionLabel: 'View/Edit Rx',
                actionIcon: <IconPencil className="w-4 h-4" />,
                onClick: () => handleOpenModal(appointment, 'edit')
            };
        } else {
            return {
                statusText: 'Rx Pending',
                statusClass: 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 border border-red-300 dark:border-red-700',
                actionLabel: 'Write Prescription',
                actionIcon: <IconPlus className="w-4 h-4" />,
                onClick: () => handleOpenModal(appointment, 'write')
            };
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 transition-colors">
            {/* Custom Tailwind Scrollbar for dark mode */}
            <style>
                {`
                .dark-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .dark-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #4b5563; /* gray-600 */
                    border-radius: 4px;
                }
                .dark-scrollbar::-webkit-scrollbar-track {
                    background-color: #1f2937; /* gray-800 */
                }
                `}
            </style>
            
            <header className="mb-8 p-4 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
                <h1 className="text-3xl font-extrabold text-blue-600  flex items-center">
                    <IconEye className="inline-block mr-3 w-8 h-8" /> 
                    Prescription
                </h1>
            </header>

            <main className="max-w-5xl mx-auto">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    
                    {/* Appointments Header */}
                    <div className="p-5 border-b border-gray-200 bg-gray-50 ">
                        <h2 className="text-xl font-semibold text-gray-800 ">
                            Upcoming and Recent Consultations ({appointments.length})
                        </h2>
                    </div>

                    {/* Appointments List */}
                    <div className="dark-scrollbar max-h-[70vh] overflow-y-auto">
                        {appointments.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 ">
                                <IconRotateCcw className="w-8 h-8 mx-auto mb-3" />
                                <p>No appointments assigned to you or found in the system.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200 ">
                                {appointments.map((appointment) => {
                                    const props = getActionProps(appointment);
                                    return (
                                        <li key={appointment.id} className="p-4 sm:p-5 hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                                            
                                            {/* Patient & Disease Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-bold text-gray-900 truncate">
                                                    {appointment.patientName}
                                                </p>
                                                <p className="text-sm text-gray-600 ">
                                                    <span className="font-medium mr-1">Disease/Reason:</span> {appointment.disease}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {appointment.date} @ {appointment.time} (ID: {appointment.id})
                                                </p>
                                            </div>

                                            {/* Status and Action */}
                                            <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${props.statusClass}`}>
                                                    {props.statusText}
                                                </span>
                                                <button
                                                    onClick={props.onClick}
                                                    className="flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-md shadow-blue-500/30"
                                                >
                                                    {props.actionIcon}
                                                    <span className="ml-1">{props.actionLabel}</span>
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                </div>
            </main>

            {/* Prescription Modal */}
            {modalMode && selectedAppointment && (
                <PrescriptionModal
                    appointment={selectedAppointment}
                    currentPrescription={selectedAppointment.prescription}
                    onClose={handleCloseModal}
                    onSave={handleSavePrescription}
                />
            )}
        </div>
    );
}

export default Prescriptions
