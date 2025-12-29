// src/pages/DoctorDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';
import {mockAppointments} from '../assets/assets';
import Sidebar from '../components/Sidebar';
import MetricsCard from '../components/MetricsCard'; 
import LatestAppointmentList from '../components/LatestAppointmentList';
import { assets } from '../assets/assets';
import { PatientIcon } from './MyProfile';




const DoctorDashboard = () => {
  const { dToken, doctorInfo } = useContext(DoctorContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const {  dashboardData, isLoading, error } = useContext(DoctorContext);



    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading Prescripto Dashboard...</div>;
    }
    // If data is null after loading (e.g., failed to fetch)
    if (error || !dashboardData) {
        return <div className="text-red-500 text-center mt-10">Error loading dashboard data.</div>;
    }

    const { metrics, latestAppointments } = dashboardData;

    // Prepare data structure for MetricsCard components
    const metricsData = [
        // Total doctors in the system (Admin metric)
        {  title: 'Earnings', count: `$${metrics.earnings}`, icon: assets.arrow_icon}, 
        // Appointments for the logged-in doctor
        { title: 'Appointments', count: metrics.appointments, icon: assets.appointment_icon },
        // Unique patients for the logged-in doctor
        { title: 'Patients', count: metrics.patients, icon: assets.people_icon }, 
    ];


 return (
      <div className="flex-1 p-6 md:p-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Prescripto Dashboard</h1>
                
                {/* 1. TOP METRICS CARDS SECTION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {metricsData.map((metric, index) => (
                        <MetricsCard 
                            key={index} 
                            title={metric.title} 
                            count={metric.count} 
                            icon={metric.icon} 
                            isAdmin={metric.admin}
                        />
                    ))}
                </div>

                {/* 2. LATEST APPOINTMENTS LIST SECTION */}
                <div className="bg-white p-6 shadow-xl rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Latest Appointment</h2>
                    <LatestAppointmentList appointments={latestAppointments} />
                </div>
            </div>
    );
  };


export default DoctorDashboard;